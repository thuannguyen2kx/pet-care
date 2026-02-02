import Stripe from "stripe";
import { config } from "../config/app.config";
import PaymentModel from "../models/payment.model";
import {
  PaymentMethodEnum,
  PaymentStatusEnum,
  PaymentProcessorEnum,
} from "../enums/payment.enum";
import { Types } from "mongoose";
import { BookingModel, PaymentStatus } from "../models/booking.model";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/app-error";
import { emitPaymentPaid } from "../socket/emitters/payment.emitter";
import {
  NotificationFactory,
  NotificationService,
} from "./notification.service";

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});
const FRONTEND_URL = config.FRONTEND_ORIGIN;

interface ServiceDetails {
  name: string;
  price: number;
}

interface CustomerDetails {
  email: string;
  name: string;
  petName: string;
  petId: string;
}

interface CheckoutSessionParams {
  bookingId: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  serviceDetails: ServiceDetails;
  customerDetails: CustomerDetails;
}

/**
 * Create a Stripe checkout session for an booking payment
 */
export const createCheckoutSession = async ({
  bookingId,
  userId,
  serviceDetails,
  customerDetails,
}: CheckoutSessionParams) => {
  const booking = await BookingModel.findById(bookingId);
  if (!booking) {
    throw new NotFoundException("Booking not found");
  }

  if (booking.customerId.toString() !== userId.toString()) {
    throw new UnauthorizedException("Not your booking");
  }

  if (booking.paymentStatus === PaymentStatusEnum.PAID) {
    throw new BadRequestException("Booking already paid");
  }

  const existingPayment = await PaymentModel.findOne({
    bookingId,
    status: PaymentStatusEnum.PENDING,
  });

  if (existingPayment) {
    throw new BadRequestException("Payment already in progress");
  }

  const payment = await PaymentModel.create({
    bookingId,
    customerId: userId,
    amount: serviceDetails.price,
    currency: "USD",
    method: PaymentMethodEnum.CARD,
    status: PaymentStatusEnum.PENDING,
    paymentProcessor: PaymentProcessorEnum.STRIPE,
  });

  const unitAmountUSD = Math.round((serviceDetails.price / 25000) * 100);

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: unitAmountUSD,
          product_data: {
            name: serviceDetails.name,
            description: `Dịch vụ ${serviceDetails.name} cho ${customerDetails.petName}`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${FRONTEND_URL}/app/payments/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
    cancel_url: `${FRONTEND_URL}/app/payments/cancel?booking_id=${bookingId}`,
    client_reference_id: bookingId.toString(),
    customer_email: customerDetails.email,
    metadata: {
      bookingId: bookingId.toString(),
      paymentId: payment._id.toString(),
      userId: userId.toString(),
      petId: customerDetails.petId,
    },
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  };

  const session = await stripe.checkout.sessions.create(params);

  payment.transactionId = session.id;
  payment.receiptUrl = session.url ?? undefined;
  await payment.save();

  booking.paymentMethod = PaymentMethodEnum.CARD;
  booking.paymentStatus = PaymentStatus.PENDING;
  await booking.save();
  return {
    sessionId: session.id,
    url: session.url!,
  };
};

/**
 * Process the Stripe webhook event
 */
export const processStripeWebhook = async (event: Stripe.Event) => {
  try {
    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Get the payment ID from metadata
      const paymentId = session.metadata?.paymentId;
      const bookingId = session.metadata?.bookingId;

      if (!paymentId || !bookingId) {
        throw new Error("Missing payment or appointment ID in Stripe webhook");
      }

      // Update payment status
      const payment = await PaymentModel.findById(paymentId);
      if (!payment) {
        throw new Error(`Payment not found: ${paymentId}`);
      }

      payment.status = PaymentStatusEnum.PAID;
      payment.transactionId = session.payment_intent as string;
      payment.updatedAt = new Date();
      await payment.save();

      const booking = await BookingModel.findById(bookingId);
      if (!booking) {
        throw new Error(`Booking not found: ${bookingId}`);
      }

      booking.paymentStatus = PaymentStatus.PAID;
      await booking.save();

      await NotificationService.create({
        ...NotificationFactory.paymentSuccess(
          payment._id.toString(),
          payment.amount,
        ),
        recipientIds: [payment.customerId.toString()],
      });

      emitPaymentPaid({
        userId: payment.customerId.toString(),
        paymentId: payment._id.toString(),
        bookingId: payment.bookingId.toString(),
      });

      return {
        success: true,
        payment,
        booking,
      };
    }

    // Handle payment_intent.succeeded event (backup in case checkout.session.completed fails)
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Find payment by transaction ID
      const payment = await PaymentModel.findOne({
        transactionId: paymentIntent.id,
      });

      if (payment && payment.status !== PaymentStatusEnum.PAID) {
        payment.status = PaymentStatusEnum.PAID;
        payment.updatedAt = new Date();
        await payment.save();

        // Update appointment payment status
        const booking = await BookingModel.findById(payment.bookingId);
        if (booking) {
          booking.paymentStatus = PaymentStatus.PAID;
          await booking.save();
        }

        await NotificationService.create({
          ...NotificationFactory.paymentSuccess(
            payment._id.toString(),
            payment.amount,
          ),
          recipientIds: [payment.customerId.toString()],
        });

        emitPaymentPaid({
          userId: payment.customerId.toString(),
          paymentId: payment._id.toString(),
          bookingId: payment.bookingId.toString(),
        });

        return {
          success: true,
          payment,
          booking,
        };
      }
    }

    return {
      success: true,
      message: `Unhandled event type: ${event.type}`,
    };
  } catch (error) {
    console.error("Stripe webhook processing error:", error);
    throw error;
  }
};

/**
 * Verify Stripe webhook signature
 */
export const verifyStripeWebhookSignature = (
  payload: string | Buffer,
  signature: string,
): Stripe.Event => {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      config.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    throw error;
  }
};

/**
 * Process a refund for a Stripe payment
 */
export const processStripeRefund = async (
  paymentIntentId: string,
  amount: number,
  reason?: string,
): Promise<Stripe.Refund> => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(amount), // Stripe expects amount in smallest currency unit
      reason: "requested_by_customer",
    });

    return refund;
  } catch (error) {
    console.error("Stripe refund processing error:", error);
    throw error;
  }
};
