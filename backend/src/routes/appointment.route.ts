import { Router } from "express";
import {
  getUserAppointmentsController,
  getAppointmentByIdController,
  createAppointmentController,
  updateAppointmentStatusController,
  cancelAppointmentController,
  getAvailableTimeSlotsController,
  getAllAppointmentsController
} from "../controllers/appointment.controller";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";

const appointmentRoutes = Router();


// Route dành cho khách hàng và nhân viên/admin
appointmentRoutes.get("/", getUserAppointmentsController);
appointmentRoutes.get("/time-slots", getAvailableTimeSlotsController);
appointmentRoutes.get("/:id", getAppointmentByIdController);
appointmentRoutes.post("/", createAppointmentController);
appointmentRoutes.put("/:id/cancel", cancelAppointmentController);

// Route chỉ dành cho nhân viên/admin
appointmentRoutes.put("/:id/status", authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]), updateAppointmentStatusController);

// Route chỉ dành cho admin
appointmentRoutes.get("/admin/all", authorizeRoles([Roles.ADMIN]), getAllAppointmentsController);

export default appointmentRoutes;