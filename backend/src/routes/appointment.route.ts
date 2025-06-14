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


appointmentRoutes.get("/", getUserAppointmentsController);
appointmentRoutes.get("/all", authorizeRoles([Roles.ADMIN]), getAllAppointmentsController);
appointmentRoutes.get("/time-slots", getAvailableTimeSlotsController);
appointmentRoutes.get("/:id", getAppointmentByIdController);
appointmentRoutes.post("/", createAppointmentController);
appointmentRoutes.put("/:id/cancel", cancelAppointmentController);

appointmentRoutes.put("/:id/status", authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]), updateAppointmentStatusController);
export default appointmentRoutes;