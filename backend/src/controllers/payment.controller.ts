import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import * as paymentService from "../services/payment.service";
import { BadRequestException, UnauthorizedException } from "../utils/app-error";
import { Roles } from "../enums/role.enum";
import { refundSchema } from "../validation/payment-validation";

/**
 * @desc    Process payment for an appointment
 * @route   POST /api/payments/process/:appointmentId
 * @access  Private
 */
export const processPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { appointmentId } = req.params;
    const { paymentMethod, stripeToken, saveCard } = req.body;

    if (!appointmentId) {
      throw new BadRequestException("Appointment ID is required");
    }

    if (!paymentMethod) {
      throw new BadRequestException("Payment method is required");
    }

    // Process the payment
    const result = await paymentService.processPaymentService({
      appointmentId,
      userId: req.user?._id,
      paymentMethod,
      stripeToken,
      saveCard,
    });

    res.status(200).json(result);
  }
);

/**
 * @desc    Get all payments for the logged-in user
 * @route   GET /api/payments
 * @access  Private
 */
export const getUserPayments = asyncHandler(
  async (req: Request, res: Response) => {
    const payments = await paymentService.getUserPaymentsService(req.user?._id);
    res.status(200).json(payments);
  }
);

/**
 * @desc    Get payment by ID
 * @route   GET /api/payments/:id
 * @access  Private
 */
export const getPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const paymentId = req.params.id;

    if (!paymentId) {
      throw new BadRequestException("Payment ID is required");
    }

    const isAdmin =
      req.user?.role === Roles.ADMIN || req.user?.role === Roles.EMPLOYEE;

    const payment = await paymentService.getPaymentByIdService(
      paymentId,
      req.user?._id,
      isAdmin
    );

    res.status(200).json(payment);
  }
);

/**
 * @desc    Update cash payment status (mark as paid)
 * @route   PUT /api/payments/:id/mark-as-paid
 * @access  Private (Admin/Employee)
 */
export const markPaymentAsPaid = asyncHandler(
  async (req: Request, res: Response) => {
    const paymentId = req.params.id;

    if (!paymentId) {
      throw new BadRequestException("Payment ID is required");
    }

    // Check if user is admin or employee
    if (req.user?.role !== Roles.ADMIN && req.user?.role !== Roles.EMPLOYEE) {
      throw new UnauthorizedException("Not authorized to perform this action");
    }

    const result = await paymentService.markPaymentAsPaidService({
      paymentId,
      adminId: req.user?._id,
    });

    res.status(200).json(result);
  }
);

/**
 * @desc    Process a refund for a payment
 * @route   POST /api/payments/:id/refund
 * @access  Private (Admin)
 */
export const refundPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const paymentId = req.params.id;

    // Validate input with Zod
    const { amount, reason } = refundSchema.parse(req.body);

    // Check if user is admin
    if (req.user?.role !== Roles.ADMIN) {
      throw new UnauthorizedException("Not authorized to perform this action");
    }

    const result = await paymentService.refundPaymentService({
      paymentId,
      amount,
      reason,
      adminId: req.user?._id,
    });

    res.status(200).json(result);
  }
);

/**
 * @desc    Get all payments (admin/employee)
 * @route   GET /api/payments/admin/all
 * @access  Private (Admin/Employee)
 */
export const getAdminPayments = asyncHandler(
  async (req: Request, res: Response) => {
    // Check if user is admin or employee
    if (req.user?.role !== Roles.ADMIN && req.user?.role !== Roles.EMPLOYEE) {
      throw new UnauthorizedException("Not authorized to perform this action");
    }

    const result = await paymentService.getAdminPaymentsService(req.query);

    res.status(200).json(result);
  }
);

/**
 * @desc    Get payments summary statistics (admin)
 * @route   GET /api/payments/admin/summary
 * @access  Private (Admin)
 */
export const getPaymentsSummary = asyncHandler(
  async (req: Request, res: Response) => {
    // Check if user is admin
    if (req.user?.role !== Roles.ADMIN) {
      throw new UnauthorizedException("Not authorized to perform this action");
    }

    const summary = await paymentService.getPaymentsSummaryService();

    res.status(200).json(summary);
  }
);
