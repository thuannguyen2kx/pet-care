import express from "express";
import {
  processPayment,
  getUserPayments,
  getPaymentById,
  markPaymentAsPaid,
  getAdminPayments,
  getPaymentsSummary,
  refundPayment,
  createCheckoutSession,
  handleSuccessfulPayment,
  getPaymentByAppointment,
} from "../controllers/payment.controller";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";

const paymentRoutes = express.Router();

paymentRoutes.post("/stripe/checkout", createCheckoutSession);
paymentRoutes.get("/success", handleSuccessfulPayment);
// Customer payment routes
paymentRoutes.post("/:bookingId/process", processPayment);
paymentRoutes.get("/", getUserPayments);
paymentRoutes.get("/by-booking/:bookingId", getPaymentByAppointment);
paymentRoutes.get("/:id", getPaymentById);

// Admin/Employee payment routes
paymentRoutes.put(
  "/:id/mark-as-paid",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  markPaymentAsPaid,
);
paymentRoutes.post("/:id/refund", authorizeRoles([Roles.ADMIN]), refundPayment);
paymentRoutes.get(
  "/admin/all",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  getAdminPayments,
);
paymentRoutes.get(
  "/admin/summary",
  authorizeRoles([Roles.ADMIN]),
  getPaymentsSummary,
);

export default paymentRoutes;
