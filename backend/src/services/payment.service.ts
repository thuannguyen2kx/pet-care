import Stripe from "stripe";
import { config } from "../config/app.config";
import PaymentModel from "../models/payment.model";
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
import { Roles, RoleType } from "../enums/role.enum";
import {
  PaymentMethodEnum,
  PaymentMethodType,
  PaymentProcessorEnum,
  PaymentStatusEnum,
} from "../enums/payment.enum";
import { Types } from "mongoose";
import {
  BookingModel,
  BookingStatus,
  PaymentStatus,
} from "../models/booking.model";

// Initialize Stripe
const stripe = new Stripe(config.STRIPE_SECRET_KEY);

// Types
interface ProcessPaymentInput {
  bookingId: string;
  role?: RoleType;
  userId: string;
  paymentMethod: PaymentMethodType;
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
  bookingId,
  role,
  userId,
  paymentMethod,
}: ProcessPaymentInput) => {
  const booking = await BookingModel.findById(bookingId);
  if (!booking) {
    throw new NotFoundException("Lịch đặt không tồn tại");
  }

  const isAdmin = role === Roles.ADMIN || role === Roles.EMPLOYEE;
  if (!isAdmin && booking.customerId.toString() !== userId.toString()) {
    throw new UnauthorizedException(
      "Not authorized to process payment for this booking",
    );
  }

  if (booking.paymentStatus === PaymentStatusEnum.PAID) {
    throw new BadRequestException("Booking already paid");
  }

  const existingPayment = await PaymentModel.findOne({
    bookingId: booking._id,
    status: { $in: [PaymentStatusEnum.PENDING, PaymentStatusEnum.PAID] },
  });

  if (existingPayment) {
    throw new BadRequestException("Payment already in progress");
  }

  const service = await ServiceModel.findById(booking.serviceId);
  if (!service) {
    throw new NotFoundException("Service not found");
  }

  const user = await UserModel.findById(userId);
  const pet = await PetModel.findById(booking.petId);

  if (!user || !pet) {
    throw new NotFoundException("User or pet not found");
  }

  // 🧾 Create payment
  const payment = await PaymentModel.create({
    bookingId: booking._id,
    customerId: user._id,
    amount: service.price,
    currency: "VND",
    method: paymentMethod,
    status: PaymentStatusEnum.PENDING,
    paymentProcessor:
      paymentMethod === PaymentMethodEnum.CARD
        ? PaymentProcessorEnum.STRIPE
        : PaymentProcessorEnum.OFFLINE,
  });

  if (paymentMethod === PaymentMethodEnum.CASH) {
    booking.status = BookingStatus.CONFIRMED;
    booking.paymentStatus = PaymentStatus.PENDING;
  } else {
    booking.status = BookingStatus.PENDING;
    booking.paymentStatus = PaymentStatus.PENDING;
  }

  await booking.save();

  return {
    success: true,
    payment,
    message:
      paymentMethod === PaymentMethodEnum.CARD
        ? "Redirect to payment gateway"
        : "Booking confirmed. Please pay at the store.",
  };
};

/**
 * Mark a cash/bank transfer payment as paid
 */
export const markPaymentAsPaidService = async ({
  paymentId,
}: MarkPaymentInput) => {
  const payment = await PaymentModel.findById(paymentId);

  if (!payment) {
    throw new NotFoundException("Payment not found");
  }

  if (payment.method !== PaymentMethodEnum.CASH) {
    throw new BadRequestException(
      "Only cash or bank transfer payments can be marked as paid manually",
    );
  }

  payment.status = PaymentStatusEnum.PAID;
  await payment.save();

  await BookingModel.findByIdAndUpdate(payment.bookingId, {
    paymentStatus: PaymentStatusEnum.PAID,
  });

  // Send payment confirmation to customer
  try {
    const user = await UserModel.findById(payment.customerId);
    const appointment = await BookingModel.findById(payment.bookingId).populate(
      "serviceId",
      "name",
    );

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
 *
 * @param appointmentId
 * @param userId
 * @param role
 * @returns
 */
export const getPaymentByAppointmentService = async (
  appointmentId: string,
  userId: string,
  role?: RoleType,
) => {
  if (!appointmentId) {
    throw new BadRequestException("Appointment ID is required");
  }

  // Find payment for the appointment
  const payment = await PaymentModel.findOne({ appointmentId })
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
    return null;
  }

  // Check if the payment belongs to the logged-in user or if user is admin/employee
  const isAdmin = role === Roles.ADMIN || role === Roles.EMPLOYEE;

  if (!isAdmin && payment.customerId._id.toString() !== userId.toString()) {
    throw new UnauthorizedException("Not authorized to access this payment");
  }
  return payment;
};

/**
 * Get a specific payment by ID
 */
export const getPaymentByIdService = async (
  paymentId: string,
  userId: string,
  isAdmin: boolean,
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
      select: "_id scheduledDate scheduledTimeSlot serviceType serviceId",
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

    const bookings = await BookingModel.find({
      serviceId: { $in: serviceIds },
    }).select("_id");

    const appointmentIds = bookings.map((appointment) => appointment._id);

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
  const now = new Date();

  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
    999,
  );

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

  const previousMonthRevenue = await PaymentModel.aggregate([
    {
      $match: {
        status: PaymentStatus.PAID,
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

  const weeklyRevenue = await PaymentModel.aggregate([
    {
      $match: {
        status: PaymentStatus.PAID,
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

  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const formattedWeeklyRevenue = daysOfWeek.map((day, index) => {
    const dayData = weeklyRevenue.find((item) => item._id === index + 1);
    return {
      day,
      amount: dayData ? dayData.amount : 0,
      count: dayData ? dayData.count : 0,
    };
  });

  const paymentsByMethod = await PaymentModel.aggregate([
    {
      $match: {
        status: PaymentStatus.PAID,
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

  const formattedPaymentsByMethod = paymentsByMethod.map((item) => ({
    name: item._id,
    value: Math.round(
      (item.count /
        (paymentsByMethod.reduce((sum, method) => sum + method.count, 0) ||
          1)) *
        100,
    ),
    amount: item.amount,
  }));

  const paymentCounts = await PaymentModel.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const statusCounts = {
    pending: 0,
    completed: 0,
    failed: 0,
    refunded: 0,
  };

  paymentCounts.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(statusCounts, item._id)) {
      statusCounts[item._id as keyof typeof statusCounts] = item.count;
    }
  });

  // Get today's completed payments
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todayPayments = await PaymentModel.countDocuments({
    status: PaymentStatus.PAID,
    createdAt: {
      $gte: todayStart,
      $lte: todayEnd,
    },
  });

  return {
    monthlyRevenue:
      currentMonthRevenue.length > 0 ? currentMonthRevenue[0].totalAmount : 0,
    previousMonthRevenue:
      previousMonthRevenue.length > 0 ? previousMonthRevenue[0].totalAmount : 0,
    weeklyRevenue: formattedWeeklyRevenue,
    paymentsByMethod: formattedPaymentsByMethod,
    statusCounts,
    todayPayments,
    pendingPayments: statusCounts.pending || 0,
    completedPayments: statusCounts.completed || 0,
  };
};

/**
 * Process a refund for a payment
 */
export const refundPaymentService = async ({
  paymentId,
  amount,
  reason,
}: RefundPaymentInput) => {
  if (!amount || amount <= 0) {
    throw new BadRequestException("Valid refund amount is required");
  }

  const payment = await PaymentModel.findById(paymentId);

  if (!payment) {
    throw new NotFoundException("Payment not found");
  }

  if (payment.status !== PaymentStatus.PAID) {
    throw new BadRequestException("Only completed payments can be refunded");
  }

  if (amount > payment.amount) {
    throw new BadRequestException(
      "Refund amount cannot exceed the payment amount",
    );
  }

  if (
    payment.method === "card" &&
    payment.paymentProcessor === "stripe" &&
    payment.transactionId
  ) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: payment.transactionId,
        amount: Math.round(amount * 100),
        reason: "requested_by_customer",
      });

      payment.status = "refunded";
      payment.refundData = {
        amount,
        reason: reason || "Customer requested refund",
        processedAt: new Date(),
      };

      await payment.save();

      const booking = await BookingModel.findById(payment.bookingId);

      if (booking) {
        booking.paymentStatus = PaymentStatus.REFUNDED;
        await booking.save();

        const user = await UserModel.findById(payment.customerId);

        if (user) {
          try {
            await emailService.sendEmail({
              to: user.email,
              subject: "Việc hoàn tiền của bạn đã được xử lý.",
              html: `
                <h1>Xác Nhận Hoàn Tiền</h1>
                <p>Kính gửi anh/chị ${user.fullName},</p>
                <p>Chúng tôi xin thông báo rằng yêu cầu hoàn tiền cho giao dịch gần đây của anh/chị đã được xử lý thành công:</p>
                <p><strong>Số tiền hoàn:</strong> ${amount.toLocaleString()} ${
                  payment.currency
                }</p>
                <p><strong>Lý do hoàn tiền:</strong> ${
                  reason || "Theo yêu cầu của khách hàng"
                }</p>
                <p><strong>Mã giao dịch hoàn tiền:</strong> ${refund.id}</p>
                <p><strong>Ngày xử lý:</strong> ${new Date().toLocaleDateString()}</p>
                <p>Số tiền hoàn lại dự kiến sẽ được chuyển vào tài khoản của anh/chị trong vòng 5–10 ngày làm việc, tùy theo quy định của ngân hàng.</p>
                <p>Nếu anh/chị có bất kỳ câu hỏi hay cần hỗ trợ thêm, vui lòng liên hệ với đội ngũ chăm sóc khách hàng của chúng tôi.</p>
                <p>Trân trọng,</p>
                <p>Đội ngũ hỗ trợ khách hàng</p>
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
        `Refund processing failed: ${stripeError.message}`,
      );
    }
  } else if (payment.method === PaymentMethodEnum.CASH) {
    payment.status = PaymentStatusEnum.REFUNDED;
    payment.refundData = {
      amount,
      reason: reason || "Customer requested refund",
      processedAt: new Date(),
    };

    await payment.save();

    // Update appointment payment status
    const booking = await BookingModel.findById(payment.bookingId);

    if (booking) {
      booking.paymentStatus = PaymentStatus.REFUNDED;
      await booking.save();
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
