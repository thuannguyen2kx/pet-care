// import { Request, Response } from "express";
// import { asyncHandler } from "../middlewares/asyncHandler.middleware";
// import * as paymentService from "../services/payment.service";
// import * as stripeService from "../services/stripe.service";
// import {
//   BadRequestException,
//   UnauthorizedException,
//   NotFoundException,
// } from "../utils/app-error";
// import { Roles } from "../enums/role.enum";
// import { refundSchema } from "../validation/payment-validation";
// import AppointmentModel, { ServiceType } from "../models/appointment.model";
// import UserModel from "../models/user.model";
// import ServiceModel from "../models/service.model";
// import ServicePackageModel from "../models/service-package.model";
// import PetModel from "../models/pet.model";
// import { PaymentMethodEnum, PaymentStatusEnum } from "../enums/payment.enum";
// import { Types } from "mongoose";
// import Stripe from "stripe";
// import { config } from "../config/app.config";

// const stripe = new Stripe(config.STRIPE_SECRET_KEY);
// /**
//  * @desc    Create Stripe checkout session
//  * @route   POST /api/payments/create-checkout-session/:appointmentId
//  * @access  Private
//  */
// export const createCheckoutSession = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { appointmentId } = req.params;

//     if (!appointmentId) {
//       throw new BadRequestException("Appointment ID is required");
//     }

//     // Fetch appointment
//     const appointment = await AppointmentModel.findById(appointmentId);

//     if (!appointment) {
//       throw new NotFoundException("Appointment not found");
//     }

//     // Check if appointment belongs to the user
//     if (appointment.customerId.toString() !== req.user?._id.toString()) {
//       throw new UnauthorizedException(
//         "Not authorized to process payment for this appointment"
//       );
//     }

//     // Check if payment already processed
//     if (appointment.paymentStatus === PaymentStatusEnum.COMPLETED) {
//       throw new BadRequestException(
//         "Payment already processed for this appointment"
//       );
//     }

//     // Get service/package details
//     let serviceDetails;

//     if (appointment.serviceType === ServiceType.SINGLE) {
//       const service = await ServiceModel.findById(appointment.serviceId);
//       if (!service) {
//         throw new NotFoundException("Service not found");
//       }
//       serviceDetails = {
//         name: service.name,
//         price: service.price,
//       };
//     } else {
//       const servicePackage = await ServicePackageModel.findById(
//         appointment.serviceId
//       );
//       if (!servicePackage) {
//         throw new NotFoundException("Service package not found");
//       }
//       serviceDetails = {
//         name: servicePackage.name,
//         price: servicePackage.discountedPrice || servicePackage.price,
//       };
//     }

//     // Get user and pet
//     const user = await UserModel.findById(req.user?._id);
//     const pet = await PetModel.findById(appointment.petId);

//     if (!user || !pet) {
//       throw new NotFoundException("User or pet not found");
//     }

//     // Customer details for Stripe
//     const customerDetails = {
//       email: user.email,
//       name: user.fullName,
//       petName: pet.name,
//       petId: (pet._id as Types.ObjectId).toString(),
//     };

//     // Create Stripe checkout session
//     const result = await stripeService.createCheckoutSession({
//       appointmentId: appointment._id as string,
//       userId: user._id as string,
//       serviceDetails,
//       customerDetails,
//     });

//     res.status(200).json(result);
//   }
// );

// /**
//  * @desc    Process Stripe webhook
//  * @route   POST /api/payments/webhook
//  * @access  Public
//  */
// export const stripeWebhook = asyncHandler(
//   async (req: Request, res: Response) => {
//     const signature = req.headers["stripe-signature"] as string;

//     if (!signature) {
//       throw new BadRequestException("Stripe signature is missing");
//     }

//     try {
//       // Verify the webhook signature
//       const event = stripeService.verifyStripeWebhookSignature(
//         req.body,
//         signature
//       );

//       // Process the webhook event
//       await stripeService.processStripeWebhook(event);

//       res.status(200).json({ received: true });
//     } catch (error: any) {
//       console.error("Webhook error:", error.message);
//       res.status(400).json({ error: `Webhook Error: ${error.message}` });
//     }
//   }
// );

// /**
//  * @desc    Process payment for an appointment
//  * @route   POST /api/payments/process/:appointmentId
//  * @access  Private
//  */
// export const processPayment = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { appointmentId } = req.params;
//     const { paymentMethod } = req.body;

//     if (!appointmentId) {
//       throw new BadRequestException("Appointment ID is required");
//     }

//     if (!paymentMethod) {
//       throw new BadRequestException("Payment method is required");
//     }

//     // If it's a card payment, redirect to Stripe checkout
//     if (paymentMethod === PaymentMethodEnum.CARD) {
//       return res.status(200).json({
//         redirectToStripe: true,
//         message: "Please complete payment through Stripe checkout",
//       });
//     }

//     // For other payment methods, use the existing service
//     const result = await paymentService.processPaymentService({
//       appointmentId,
//       role: req.user?.role,
//       userId: req.user?._id,
//       paymentMethod,
//     });

//     res.status(200).json(result);
//   }
// );

// /**
//  * @desc    Get all payments for the logged-in user
//  * @route   GET /api/payments
//  * @access  Private
//  */
// export const getUserPayments = asyncHandler(
//   async (req: Request, res: Response) => {
//     const payments = await paymentService.getUserPaymentsService(req.user?._id);
//     res.status(200).json({ payments });
//   }
// );
// /**
//  * @desc    Get payment by appointment ID
//  * @route   GET /api/payments/by-appointment/:appointmentId
//  * @access  Private
//  */
// export const getPaymentByAppointment = asyncHandler(
//   async (req: Request, res: Response) => {
//     const appointmentId = req.params.appointmentId;
//     const payment = await paymentService.getPaymentByAppointmentService(
//       appointmentId,
//       req.user?._id,
//       req.user?.role
//     );

//     res.status(200).json({ payment });
//   }
// );

// /**
//  * @desc    Get payment by ID
//  * @route   GET /api/payments/:id
//  * @access  Private
//  */
// export const getPaymentById = asyncHandler(
//   async (req: Request, res: Response) => {
//     const paymentId = req.params.id;

//     if (!paymentId) {
//       throw new BadRequestException("Payment ID is required");
//     }

//     const isAdmin =
//       req.user?.role === Roles.ADMIN || req.user?.role === Roles.EMPLOYEE;

//     const payment = await paymentService.getPaymentByIdService(
//       paymentId,
//       req.user?._id,
//       isAdmin
//     );

//     res.status(200).json({ payment });
//   }
// );

// /**
//  * @desc    Update cash payment status (mark as paid)
//  * @route   PUT /api/payments/:id/mark-as-paid
//  * @access  Private (Admin/Employee)
//  */
// export const markPaymentAsPaid = asyncHandler(
//   async (req: Request, res: Response) => {
//     const paymentId = req.params.id;

//     if (!paymentId) {
//       throw new BadRequestException("Payment ID is required");
//     }

//     // Check if user is admin or employee
//     if (req.user?.role !== Roles.ADMIN && req.user?.role !== Roles.EMPLOYEE) {
//       throw new UnauthorizedException("Not authorized to perform this action");
//     }

//     const result = await paymentService.markPaymentAsPaidService({
//       paymentId,
//       adminId: req.user?._id,
//     });

//     res.status(200).json(result);
//   }
// );

// /**
//  * @desc    Process a refund for a payment
//  * @route   POST /api/payments/:id/refund
//  * @access  Private (Admin)
//  */
// export const refundPayment = asyncHandler(
//   async (req: Request, res: Response) => {
//     const paymentId = req.params.id;

//     // Validate input with Zod
//     const { amount, reason } = refundSchema.parse(req.body);

//     // Check if user is admin
//     if (req.user?.role !== Roles.ADMIN) {
//       throw new UnauthorizedException("Not authorized to perform this action");
//     }

//     const result = await paymentService.refundPaymentService({
//       paymentId,
//       amount,
//       reason,
//       adminId: req.user?._id,
//     });

//     res.status(200).json(result);
//   }
// );

// /**
//  * @desc    Get all payments (admin/employee)
//  * @route   GET /api/payments/admin/all
//  * @access  Private (Admin/Employee)
//  */
// export const getAdminPayments = asyncHandler(
//   async (req: Request, res: Response) => {
//     // Check if user is admin or employee
//     if (req.user?.role !== Roles.ADMIN && req.user?.role !== Roles.EMPLOYEE) {
//       throw new UnauthorizedException("Not authorized to perform this action");
//     }

//     const result = await paymentService.getAdminPaymentsService(req.query);

//     res.status(200).json(result);
//   }
// );

// /**
//  * @desc    Get payments summary statistics (admin)
//  * @route   GET /api/payments/admin/summary
//  * @access  Private (Admin)
//  */
// export const getPaymentsSummary = asyncHandler(
//   async (req: Request, res: Response) => {
//     // Check if user is admin
//     if (req.user?.role !== Roles.ADMIN) {
//       throw new UnauthorizedException("Not authorized to perform this action");
//     }

//     const summary = await paymentService.getPaymentsSummaryService();

//     res.status(200).json(summary);
//   }
// );

// /**
//  * @desc    Handle successful Stripe payment (after redirect)
//  * @route   GET /api/payments/success
//  * @access  Private
//  */
// export const handleSuccessfulPayment = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { session_id } = req.query;

//     if (!session_id) {
//       throw new BadRequestException("Session ID is required");
//     }

//     // Verify the session
//     try {
//       const session = await stripe.checkout.sessions.retrieve(
//         session_id as string
//       );

//       if (session.payment_status === "paid") {
//         return res.status(200).json({
//           success: true,
//           message: "Payment successful",
//           appointmentId: session.metadata?.appointmentId,
//         });
//       } else {
//         return res.status(400).json({
//           success: false,
//           message: "Payment not completed",
//         });
//       }
//     } catch (error) {
//       throw new BadRequestException("Invalid session ID");
//     }
//   }
// );
