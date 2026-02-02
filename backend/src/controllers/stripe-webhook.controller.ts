import { Request, Response } from "express";
import Stripe from "stripe";
import { config } from "../config/app.config";
import PaymentModel from "../models/payment.model";
import UserModel from "../models/user.model";
import emailService from "../utils/send-email";
import { PaymentStatusEnum } from "../enums/payment.enum";
import { BookingModel, PaymentStatus } from "../models/booking.model";

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

/**
 * Handle Stripe webhook events
 * @route POST /api/webhook/stripe
 * @access Public
 */
export const handleStripeWebhook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    res.status(400).json({ message: "Stripe signature is missing" });
    return;
  }

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    res.status(400).json({ message: `Webhook Error: ${err.message}` });
    return;
  }

  // Handle specific events
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent,
        );
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent,
        );
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ message: "Error processing webhook" });
  }
};

/**
 * Handle successful payment intent
 */
const handlePaymentIntentSucceeded = async (
  paymentIntent: Stripe.PaymentIntent,
): Promise<void> => {
  try {
    // Extract metadata
    const { bookingId, petId, userId } = paymentIntent.metadata;

    if (!bookingId) {
      console.error(
        "Payment Intent lacks appointmentId in metadata",
        paymentIntent.id,
      );
      return;
    }

    const existingPayment = await PaymentModel.findOne({
      transactionId: paymentIntent.id,
    });

    // If payment already recorded, skip processing
    if (existingPayment && existingPayment.status === PaymentStatusEnum.PAID) {
      return;
    }

    // Get appointment
    const booking = await BookingModel.findById(bookingId)
      .populate("serviceId", "name price")
      .populate("petId", "name");

    if (!booking) {
      console.error(`Appointment not found: ${bookingId}`);
      return;
    }

    // Get user
    const user = await UserModel.findById(userId);

    if (!user) {
      console.error(`User not found: ${userId}`);
      return;
    }

    // Create or update payment record
    if (existingPayment) {
      existingPayment.status = PaymentStatusEnum.PAID;
      await existingPayment.save();
    } else {
      // Create new payment record
      await PaymentModel.create({
        bookingId,
        customerId: userId,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency.toUpperCase(),
        method: "card",
        status: "completed",
        transactionId: paymentIntent.id,
        paymentProcessor: "stripe",
        receiptUrl: "",
        // receiptUrl: (paymentIntent.charges.data[0] as any)?.receipt_url
      });
    }

    // Update appointment payment status
    booking.paymentStatus = PaymentStatus.PAID;
    await booking.save();

    // Send receipt email
    try {
      await emailService.sendReceipt({
        to: user.email,
        customerName: user.fullName,
        serviceName: (booking.serviceId as any).name,
        petName: (booking.petId as any).name,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        date: new Date(),
        transactionId: paymentIntent.id,
      });
    } catch (emailError) {
      console.error("Failed to send receipt email:", emailError);
    }
  } catch (error) {
    console.error("Error handling payment_intent.succeeded:", error);
    throw error;
  }
};

/**
 * Handle failed payment intent
 */
const handlePaymentIntentFailed = async (
  paymentIntent: Stripe.PaymentIntent,
): Promise<void> => {
  try {
    // Extract metadata
    const { bookingId, userId } = paymentIntent.metadata;

    if (!bookingId) {
      console.error(
        "Payment Intent lacks appointmentId in metadata",
        paymentIntent.id,
      );
      return;
    }

    // Find existing payment by transaction ID
    const existingPayment = await PaymentModel.findOne({
      transactionId: paymentIntent.id,
    });

    // Update payment status if it exists
    if (existingPayment) {
      existingPayment.status = "failed";
      await existingPayment.save();
    } else {
      // Create new payment record with failed status
      await PaymentModel.create({
        bookingId,
        customerId: userId,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency.toUpperCase(),
        method: "card",
        status: "failed",
        transactionId: paymentIntent.id,
        paymentProcessor: "stripe",
      });
    }

    // Get appointment
    const booking = await BookingModel.findById(bookingId);

    if (booking) {
      booking.paymentStatus = PaymentStatus.FAILED;
      await booking.save();
    }

    // Get user
    const user = await UserModel.findById(userId);

    if (user) {
      // Send notification email about failed payment
      try {
        await emailService.sendEmail({
          to: user.email,
          subject: "Thanh toán thất bại",
          html: `
            <p>Chào ${user.fullName},</p>
            <h1>Thanh Toán Thất Bại</h1>
            <p>Chúng tôi không thể xử lý thanh toán của bạn cho lịch hẹn #${bookingId}.</p>
            <p>Lý do: ${
              paymentIntent.last_payment_error?.message ||
              "Giao dịch đã bị từ chối"
            }</p>
            <p>Vui lòng thử lại hoặc liên hệ với đội ngũ hỗ trợ nếu bạn cần trợ giúp.</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send payment failure email:", emailError);
      }
    }
  } catch (error) {
    console.error("Error handling payment_intent.payment_failed:", error);
    throw error;
  }
};

/**
 * Handle refunded charge
 */
const handleChargeRefunded = async (charge: Stripe.Charge): Promise<void> => {
  try {
    // Find related payment by transaction ID
    const payment = await PaymentModel.findOne({
      transactionId: charge.payment_intent,
    });

    if (!payment) {
      console.error(`Payment not found for charge: ${charge.id}`);
      return;
    }

    // Calculate refund amount
    const refundAmount = charge.amount_refunded / 100; // Convert from cents

    // Update payment record
    payment.status = "refunded";
    payment.refundData = {
      amount: refundAmount,
      reason: "Processed via Stripe",
      processedAt: new Date(),
    };
    await payment.save();

    // Update appointment payment status
    const booking = await BookingModel.findById(payment.bookingId);

    if (booking) {
      booking.paymentStatus = PaymentStatus.REFUNDED;
      await booking.save();
    }

    // Get user
    const user = await UserModel.findById(payment.customerId);

    if (user) {
      // Send refund notification email
      try {
        await emailService.sendEmail({
          to: user.email,
          subject: "Your Refund Has Been Processed",
          html: `
            <h1>Refund Confirmation</h1>
            <p>Dear ${user.fullName},</p>
            <p>We've processed a refund for your recent payment:</p>
            <p><strong>Amount:</strong> ${refundAmount.toLocaleString()} ${payment.currency}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p>The refund should appear in your account within 5-10 business days, depending on your bank.</p>
            <p>If you have any questions, please contact our support team.</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send refund email:", emailError);
      }
    }
  } catch (error) {
    console.error("Error handling charge.refunded:", error);
    throw error;
  }
};
