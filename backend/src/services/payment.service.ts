import Stripe from "stripe";
import { config } from "../config/app.config";
import PaymentModel from "../models/payment.model";
import AppointmentModel, { ServiceType } from "../models/appointment.model";
import UserModel from "../models/user.model";
import ServiceModel from "../models/service.model";
import ServicePackageModel from "../models/service-package.model";
import PetModel from "../models/pet.model";
import emailService from "../utils/send-email";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/app-error";
import {
  PaymentMethodEnum,
  PaymentMethodType,
  PaymentProcessorEnum,
  PaymentStatusEnum,
} from "../enums/payment.enum";
import { Types } from "mongoose";

// Initialize Stripe
const stripe = new Stripe(config.STRIPE_SECRET_KEY);

// Types
interface ProcessPaymentInput {
  appointmentId: string;
  userId: string;
  paymentMethod: PaymentMethodType;
  stripeToken?: string;
  saveCard?: boolean;
}

interface MarkPaymentInput {
  paymentId: string;
  adminId: string;
}

interface RefundPaymentInput {
  paymentId: string;
  amount: number;
  reason?: string;
  adminId: string;
}

/**
 * Process payment for an appointment
 */
export const processPaymentService = async ({
  appointmentId,
  userId,
  paymentMethod,
  stripeToken,
  saveCard,
}: ProcessPaymentInput) => {
  // Fetch appointment
  const appointment = await AppointmentModel.findById(appointmentId);

  if (!appointment) {
    throw new NotFoundException("Appointment not found");
  }

  // Check if appointment belongs to the user
  if (appointment.customerId.toString() !== userId) {
    throw new UnauthorizedException(
      "Not authorized to process payment for this appointment"
    );
  }

  // Check if payment already processed
  if (appointment.paymentStatus === PaymentStatusEnum.COMPLETED) {
    throw new BadRequestException(
      "Payment already processed for this appointment"
    );
  }

  // Get service/package details
  let serviceName: string;
  let servicePrice: number;

  if (appointment.serviceType === ServiceType.SINGLE) {
    const service = await ServiceModel.findById(appointment.serviceId);
    if (!service) {
      throw new NotFoundException("Service not found");
    }
    serviceName = service.name;
    servicePrice = service.price;
  } else {
    const servicePackage = await ServicePackageModel.findById(
      appointment.serviceId
    );
    if (!servicePackage) {
      throw new NotFoundException("Service package not found");
    }
    serviceName = servicePackage.name;
    servicePrice = servicePackage.discountedPrice || servicePackage.price;
  }

  // Get user and pet
  const user = await UserModel.findById(userId);
  const pet = await PetModel.findById(appointment.petId);

  if (!user || !pet) {
    throw new NotFoundException("User or pet not found");
  }

  // Process payment
  let paymentResult;

  if (paymentMethod === PaymentMethodEnum.CARD) {
    if (!stripeToken) {
      throw new BadRequestException(
        "Stripe token is required for card payments"
      );
    }

    try {
      // Calculate amount in cents
      const amount = Math.round(servicePrice * 100);

      // Create customer in Stripe if needed and save card
      // let stripeCustomerId = user.stripeCustomerId;

      // if (saveCard && !stripeCustomerId) {
      //   const customer = await stripe.customers.create({
      //     email: user.email,
      //     name: user.fullName,
      //     source: stripeToken
      //   });

      //   stripeCustomerId = customer.id;

      //   // Update user with Stripe customer ID
      //   await User.findByIdAndUpdate(user._id, { stripeCustomerId });
      // }

      // Process payment
      let paymentIntent;

      // if (saveCard && stripeCustomerId) {
      //   paymentIntent = await stripe.paymentIntents.create({
      //     amount,
      //     currency: 'vnd',
      //     customer: stripeCustomerId,
      //     description: `Payment for ${serviceName} service for ${pet.name}`,
      //     metadata: {
      //       appointmentId: appointment._id.toString(),
      //       petId: pet._id.toString(),
      //       userId: user._id.toString()
      //     }
      //   });
      // }

      paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "vnd",
        payment_method: stripeToken,
        confirm: true,
        description: `Thanh toán  dịch vụ ${serviceName} cho ${pet.name}`,
        metadata: {
          appointmentId: (appointment._id as Types.ObjectId).toString(),
          petId: (pet._id as Types.ObjectId).toString(),
          userId: (user._id as Types.ObjectId).toString(),
        },
      });

      paymentResult = paymentIntent;
    } catch (stripeError: any) {
      throw new BadRequestException(
        `Payment processing failed: ${stripeError.message}`
      );
    }
  } else if (paymentMethod === "cash") {
    // For cash payments, we just mark it as pending
    paymentResult = {
      id: "cash_payment_" + Date.now(),
      status: "pending",
    };
  } else if (paymentMethod === "bank_transfer") {
    // For bank transfers, we mark it as pending
    paymentResult = {
      id: "bank_transfer_" + Date.now(),
      status: "pending",
    };
  } else {
    throw new BadRequestException("Invalid payment method");
  }

  // Create payment record
  const payment = await PaymentModel.create({
    appointmentId: appointment._id,
    customerId: user._id,
    amount: servicePrice,
    currency: "VND",
    method: paymentMethod,
    status:
      paymentMethod === PaymentMethodEnum.CARD
        ? PaymentStatusEnum.COMPLETED
        : PaymentStatusEnum.PENDING,
    transactionId: paymentResult.id,
    paymentProcessor:
      paymentMethod === PaymentMethodEnum.CARD
        ? PaymentProcessorEnum.STRIPE
        : PaymentProcessorEnum.OFFLINE,
  });

  // Update appointment payment status
  appointment.paymentStatus =
    paymentMethod === "card" ? "completed" : "pending";
  await appointment.save();

  // If card payment was successful, send receipt
  if (paymentMethod === "card") {
    try {
      await emailService.sendEmail({
        to: user.email,
        subject: "Your Payment Receipt",
        html: `
          <h1>Payment Receipt</h1>
          <p>Thank you for your payment!</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Pet:</strong> ${pet.name}</p>
          <p><strong>Amount:</strong> ${servicePrice.toLocaleString()} VND</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Transaction ID:</strong> ${paymentResult.id}</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send receipt email:", emailError);
    }
  }

  return {
    success: true,
    payment,
    message:
      paymentMethod === "card"
        ? "Payment processed successfully"
        : "Appointment confirmed. Please pay at the store.",
  };
};

/**
 * Mark a cash/bank transfer payment as paid
 */
export const markPaymentAsPaidService = async ({
  paymentId,
  adminId,
}: MarkPaymentInput) => {
  const payment = await PaymentModel.findById(paymentId);

  if (!payment) {
    throw new NotFoundException("Payment not found");
  }

  // Only cash or bank transfer payments can be marked as completed manually
  if (payment.method !== "cash" && payment.method !== "bank_transfer") {
    throw new BadRequestException(
      "Only cash or bank transfer payments can be marked as paid manually"
    );
  }

  // Update payment status
  payment.status = "completed";
  await payment.save();

  // Update appointment payment status
  await AppointmentModel.findByIdAndUpdate(payment.appointmentId, {
    paymentStatus: "completed",
  });

  // Send payment confirmation to customer
  try {
    const user = await UserModel.findById(payment.customerId);
    const appointment = await AppointmentModel.findById(
      payment.appointmentId
    ).populate("serviceId", "name");

    if (user && appointment) {
      await emailService.sendEmail({
        to: user.email,
        subject: "Payment Confirmation",
        html: `
          <h1>Payment Confirmation</h1>
          <p>Dear ${user.fullName},</p>
          <p>We're confirming that we've received your payment for:</p>
          <p><strong>Service:</strong> ${
            (appointment.serviceId as any).name
          }</p>
          <p><strong>Amount:</strong> ${payment.amount.toLocaleString()} ${
          payment.currency
        }</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p>Thank you for your business!</p>
        `,
      });
    }
  } catch (emailError) {
    console.error("Failed to send payment confirmation email:", emailError);
  }

  return {
    success: true,
    payment,
    message: "Payment marked as completed",
  };
};

/**
 * Get payments for the current user
 */
export const getUserPaymentsService = async (userId: string) => {
  const payments = await PaymentModel.find({ customerId: userId })
    .populate({
      path: "appointmentId",
      select: "scheduledDate scheduledTimeSlot serviceType serviceId petId",
      populate: [
        {
          path: "serviceId",
          select: "name",
        },
        {
          path: "petId",
          select: "name",
        },
      ],
    })
    .sort({ createdAt: -1 });

  return payments;
};

/**
 * Get a specific payment by ID
 */
export const getPaymentByIdService = async (
  paymentId: string,
  userId: string,
  isAdmin: boolean
) => {
  const payment = await PaymentModel.findById(paymentId)
    .populate({
      path: "appointmentId",
      select:
        "scheduledDate scheduledTimeSlot serviceType serviceId petId customerId",
      populate: [
        {
          path: "serviceId",
          select: "name price",
        },
        {
          path: "petId",
          select: "name type breed",
        },
      ],
    })
    .populate({
      path: "customerId",
      select: "fullName email phoneNumber",
    });

  if (!payment) {
    throw new NotFoundException("Payment not found");
  }

  // Check if the payment belongs to the logged-in user or if user is admin
  if (!isAdmin && payment.customerId._id.toString() !== userId) {
    throw new UnauthorizedException("Not authorized to access this payment");
  }

  return payment;
};

/**
 * Get all payments (admin/employee only)
 */
export const getAdminPaymentsService = async (query: any) => {
  const {
    status,
    method,
    startDate,
    endDate,
    search,
    page = 1,
    limit = 20,
  } = query;

  // Build filter object
  const filter: any = {};

  if (status && Object.values(PaymentStatusEnum).includes(status)) {
    filter.status = status;
  }

  if (method && Object.values(PaymentMethodEnum).includes(method)) {
    filter.method = method;
  }

  // Date range filter
  if (startDate || endDate) {
    filter.createdAt = {};

    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      // Set time to end of day
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = endDateTime;
    }
  }

  // Calculate pagination
  const skip = (Number(page) - 1) * Number(limit);

  // Fetch payments with populated data
  let paymentsQuery = PaymentModel.find(filter)
    .populate({
      path: "appointmentId",
      select: "scheduledDate scheduledTimeSlot serviceType serviceId",
      populate: {
        path: "serviceId",
        select: "name",
      },
    })
    .populate({
      path: "customerId",
      select: "fullName email phoneNumber",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  // If search term is provided, handle complex search
  if (search) {
    // Get customers that match search term
    const customers = await UserModel.find({
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    const customerIds = customers.map((customer) => customer._id);

    // Get services that match search term
    const services = await ServiceModel.find({
      name: { $regex: search, $options: "i" },
    }).select("_id");

    const serviceIds = services.map((service) => service._id);

    // Get appointments with matching services
    const appointments = await AppointmentModel.find({
      serviceId: { $in: serviceIds },
    }).select("_id");

    const appointmentIds = appointments.map((appointment) => appointment._id);

    // Add search filter
    filter.$or = [
      { customerId: { $in: customerIds } },
      { appointmentId: { $in: appointmentIds } },
      { transactionId: { $regex: search, $options: "i" } },
    ];

    // Recreate query with updated filter
    paymentsQuery = PaymentModel.find(filter)
      .populate({
        path: "appointmentId",
        select: "scheduledDate scheduledTimeSlot serviceType serviceId",
        populate: {
          path: "serviceId",
          select: "name",
        },
      })
      .populate({
        path: "customerId",
        select: "fullName email phoneNumber",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
  }

  // Execute query
  const payments = await paymentsQuery.exec();

  // Get total count for pagination
  const totalCount = await PaymentModel.countDocuments(filter);

  return {
    payments,
    pagination: {
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(totalCount / Number(limit)),
    },
  };
};

/**
 * Get payments summary statistics (admin only)
 */
export const getPaymentsSummaryService = async () => {
  // Get current date
  const now = new Date();

  // Set start and end of current month
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  // Set start and end of previous month
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
    999
  );

  // Set start and end of current week (starting Sunday)
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);

  const currentWeekEnd = new Date(now);
  currentWeekEnd.setDate(now.getDate() + (6 - now.getDay()));
  currentWeekEnd.setHours(23, 59, 59, 999);

  // Get total revenue for current month
  const currentMonthRevenue = await PaymentModel.aggregate([
    {
      $match: {
        status: "completed",
        createdAt: {
          $gte: currentMonthStart,
          $lte: currentMonthEnd,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  // Get total revenue for previous month
  const previousMonthRevenue = await PaymentModel.aggregate([
    {
      $match: {
        status: "completed",
        createdAt: {
          $gte: previousMonthStart,
          $lte: previousMonthEnd,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  // Get weekly revenue breakdown
  const weeklyRevenue = await PaymentModel.aggregate([
    {
      $match: {
        status: "completed",
        createdAt: {
          $gte: currentWeekStart,
          $lte: currentWeekEnd,
        },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        amount: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Transform weekly data for frontend
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const formattedWeeklyRevenue = daysOfWeek.map((day, index) => {
    const dayData = weeklyRevenue.find((item) => item._id === index + 1);
    return {
      day,
      amount: dayData ? dayData.amount : 0,
      count: dayData ? dayData.count : 0,
    };
  });

  // Get payment method distribution
  const paymentsByMethod = await PaymentModel.aggregate([
    {
      $match: {
        status: "completed",
        createdAt: {
          $gte: currentMonthStart,
          $lte: currentMonthEnd,
        },
      },
    },
    {
      $group: {
        _id: "$method",
        count: { $sum: 1 },
        amount: { $sum: "$amount" },
      },
    },
  ]);

  // Format payment methods
  const formattedPaymentsByMethod = paymentsByMethod.map((item) => ({
    name: item._id,
    value: item.count,
    amount: item.amount,
  }));

  // Get counts by status
  const paymentCounts = await PaymentModel.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Format status counts
  const statusCounts: Record<string, number> = {
    pending: 0,
    completed: 0,
    failed: 0,
    refunded: 0,
  };

  paymentCounts.forEach((item) => {
    if (statusCounts.hasOwnProperty(item._id)) {
      statusCounts[item._id] = item.count;
    }
  });

  // Get today's completed payments
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayPayments = await PaymentModel.countDocuments({
    status: "completed",
    createdAt: {
      $gte: todayStart,
      $lte: todayEnd,
    },
  });

  // Assemble summary object
  return {
    monthlyRevenue:
      currentMonthRevenue.length > 0 ? currentMonthRevenue[0].totalAmount : 0,
    previousMonthRevenue:
      previousMonthRevenue.length > 0 ? previousMonthRevenue[0].totalAmount : 0,
    weeklyRevenue: formattedWeeklyRevenue,
    paymentsByMethod: formattedPaymentsByMethod,
    statusCounts,
    todayPayments,
  };
};

/**
 * Process a refund for a payment
 */
export const refundPaymentService = async ({
  paymentId,
  amount,
  reason,
  adminId,
}: RefundPaymentInput) => {
  // Validate input
  if (!amount || amount <= 0) {
    throw new BadRequestException("Valid refund amount is required");
  }

  // Find payment
  const payment = await PaymentModel.findById(paymentId);

  if (!payment) {
    throw new NotFoundException("Payment not found");
  }

  // Check if payment can be refunded
  if (payment.status !== "completed") {
    throw new BadRequestException("Only completed payments can be refunded");
  }

  // Check if amount is valid
  if (amount > payment.amount) {
    throw new BadRequestException(
      "Refund amount cannot exceed the payment amount"
    );
  }

  // Process refund through payment processor if it's a card payment
  if (
    payment.method === "card" &&
    payment.paymentProcessor === "stripe" &&
    payment.transactionId
  ) {
    try {
      // Process refund through Stripe
      const refund = await stripe.refunds.create({
        payment_intent: payment.transactionId,
        amount: Math.round(amount * 100), // Convert to cents
        reason: "requested_by_customer",
      });

      // Update payment in database
      payment.status = "refunded";
      payment.refundData = {
        amount,
        reason: reason || "Customer requested refund",
        processedAt: new Date(),
      };

      await payment.save();

      // Get related appointment
      const appointment = await AppointmentModel.findById(
        payment.appointmentId
      );

      if (appointment) {
        // Update appointment payment status
        appointment.paymentStatus = PaymentStatusEnum.REFUNDED;
        await appointment.save();

        // Notify customer of refund
        const user = await UserModel.findById(payment.customerId);

        if (user) {
          try {
            await emailService.sendEmail({
              to: user.email,
              subject: "Your Refund Has Been Processed",
              html: `
                <h1>Refund Confirmation</h1>
                <p>Dear ${user.fullName},</p>
                <p>We've processed a refund for your recent payment:</p>
                <p><strong>Amount:</strong> ${amount.toLocaleString()} ${
                payment.currency
              }</p>
                <p><strong>Reason:</strong> ${reason || "Customer request"}</p>
                <p><strong>Transaction ID:</strong> ${refund.id}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p>The refund should appear in your account within 5-10 business days, depending on your bank.</p>
                <p>If you have any questions, please contact our support team.</p>
              `,
            });
          } catch (emailError) {
            console.error("Failed to send refund email:", emailError);
          }
        }
      }

      return {
        success: true,
        payment,
        refundId: refund.id,
        message: "Refund processed successfully",
      };
    } catch (stripeError: any) {
      throw new BadRequestException(
        `Refund processing failed: ${stripeError.message}`
      );
    }
  } else if (
    payment.method === PaymentMethodEnum.CASH ||
    payment.method === PaymentMethodEnum.BANK_TRANSFER
  ) {
    // For cash payments, just mark as refunded in our system
    payment.status = PaymentStatusEnum.REFUNDED;
    payment.refundData = {
      amount,
      reason: reason || "Customer requested refund",
      processedAt: new Date(),
    };

    await payment.save();

    // Update appointment payment status
    const appointment = await AppointmentModel.findById(payment.appointmentId);

    if (appointment) {
      appointment.paymentStatus = PaymentStatusEnum.REFUNDED;
      await appointment.save();
    }

    return {
      success: true,
      payment,
      message: `${
        payment.method.charAt(0).toUpperCase() + payment.method.slice(1)
      } refund recorded successfully`,
    };
  } else {
    throw new BadRequestException("Unsupported payment method for refund");
  }
};
