import Stripe from "stripe";
import { config } from "../config/app.config";
import PaymentModel from "../models/payment.model";
import AppointmentModel from "../models/appointment.model";
import { PaymentMethodEnum, PaymentStatusEnum, PaymentProcessorEnum } from "../enums/payment.enum";
import { Types } from "mongoose";

// Initialize Stripe
const stripe = new Stripe(config.STRIPE_SECRET_KEY);
const FRONTEND_URL = config.FRONTEND_ORIGIN

// Define type interfaces
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
  appointmentId: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  serviceDetails: ServiceDetails;
  customerDetails: CustomerDetails;
}

interface CheckoutSessionResult {
  sessionId: string;
  url: string | null;
  payment: any; // Use your PaymentModel type here if available
}

interface WebhookProcessResult {
  success: boolean;
  payment?: any;
  appointment?: any;
  message?: string;
}

/**
 * Create a Stripe checkout session for an appointment payment
 */
export const createCheckoutSession = async ({
  appointmentId,
  userId,
  serviceDetails,
  customerDetails,
}: CheckoutSessionParams): Promise<CheckoutSessionResult> => {
  try {
    // Create a pending payment record
    const payment = await PaymentModel.create({
      appointmentId,
      customerId: userId,
      amount: serviceDetails.price,
      currency: "VND",
      method: PaymentMethodEnum.CARD,
      status: PaymentStatusEnum.PENDING,
      paymentProcessor: PaymentProcessorEnum.STRIPE,
    });

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "vnd",
          unit_amount: Math.round(serviceDetails.price), // Stripe expects amount in smallest currency unit
          product_data: {
            name: serviceDetails.name,
            description: `Dịch vụ ${serviceDetails.name} cho ${customerDetails.petName}`,
          },
        },
        quantity: 1,
      },
    ];

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${FRONTEND_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/payments/cancel?appointment_id=${appointmentId}`,
      client_reference_id: appointmentId.toString(),
      customer_email: customerDetails.email,
      metadata: {
        appointmentId: appointmentId.toString(),
        paymentId: (payment._id as Types.ObjectId).toString(),
        petId: customerDetails.petId,
        userId: userId.toString(),
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
      payment,
    };
  } catch (error) {
    console.error("Stripe checkout session creation error:", error);
    throw error;
  }
};

/**
 * Process the Stripe webhook event
 */
export const processStripeWebhook = async (
  event: Stripe.Event
): Promise<WebhookProcessResult> => {
  try {
    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Get the payment ID from metadata
      const paymentId = session.metadata?.paymentId;
      const appointmentId = session.metadata?.appointmentId;
      
      if (!paymentId || !appointmentId) {
        throw new Error("Missing payment or appointment ID in Stripe webhook");
      }
      
      // Update payment status
      const payment = await PaymentModel.findById(paymentId);
      if (!payment) {
        throw new Error(`Payment not found: ${paymentId}`);
      }
      
      payment.status = PaymentStatusEnum.COMPLETED;
      payment.transactionId = session.payment_intent as string;
      payment.updatedAt = new Date();
      await payment.save();
      
      // Update appointment payment status
      const appointment = await AppointmentModel.findById(appointmentId);
      if (!appointment) {
        throw new Error(`Appointment not found: ${appointmentId}`);
      }
      
      appointment.paymentStatus = PaymentStatusEnum.COMPLETED;
      await appointment.save();
      
      return {
        success: true,
        payment,
        appointment
      };
    }
    
    // Handle payment_intent.succeeded event (backup in case checkout.session.completed fails)
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Find payment by transaction ID
      const payment = await PaymentModel.findOne({ 
        transactionId: paymentIntent.id 
      });
      
      if (payment && payment.status !== PaymentStatusEnum.COMPLETED) {
        payment.status = PaymentStatusEnum.COMPLETED;
        payment.updatedAt = new Date();
        await payment.save();
        
        // Update appointment payment status
        const appointment = await AppointmentModel.findById(payment.appointmentId);
        if (appointment) {
          appointment.paymentStatus = PaymentStatusEnum.COMPLETED;
          await appointment.save();
        }
        
        return {
          success: true,
          payment,
          appointment
        };
      }
    }
    
    return {
      success: true,
      message: `Unhandled event type: ${event.type}`
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
  signature: string
): Stripe.Event => {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      config.STRIPE_WEBHOOK_SECRET
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
  reason?: string
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