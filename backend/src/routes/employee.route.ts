import { Router } from "express";
import {
  getAllEmployeesController,
  getEmployeeByIdController,
  createEmployeeController,
  updateEmployeeController,
  deleteEmployeeController,
  uploadEmployeeProfilePictureController,
  resetEmployeePasswordController,
  getEmployeePerformanceController,
  getEmployeeScheduleController,
  updateEmployeeAvailabilityController,
  assignAppointmentToEmployeeController,
} from "../controllers/employee.controller";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";

const employeeRoutes = Router();

// Routes that require admin access
// Get all employees
employeeRoutes.get(
  "/",
  authorizeRoles([Roles.ADMIN]),
  getAllEmployeesController
);

// Create a new employee
employeeRoutes.post(
  "/",
  authorizeRoles([Roles.ADMIN]),
  createEmployeeController
);

// Get employee by ID
employeeRoutes.get(
  "/:id",
  authorizeRoles([Roles.ADMIN]),
  getEmployeeByIdController
);

// Update employee
employeeRoutes.put(
  "/:id",
  authorizeRoles([Roles.ADMIN]),
  updateEmployeeController
);

// Delete employee
employeeRoutes.delete(
  "/:id",
  authorizeRoles([Roles.ADMIN]),
  deleteEmployeeController
);

// Upload employee profile picture
employeeRoutes.post(
  "/:id/profile-picture",
  authorizeRoles([Roles.ADMIN]),
  uploadEmployeeProfilePictureController
);

// Reset employee password
employeeRoutes.put(
  "/:id/reset-password",
  authorizeRoles([Roles.ADMIN]),
  resetEmployeePasswordController
);

// Get employee performance metrics
employeeRoutes.get(
  "/:id/performance",
  authorizeRoles([Roles.ADMIN]),
  getEmployeePerformanceController
);

// Update employee availability
employeeRoutes.put(
  "/:id/availability",
  authorizeRoles([Roles.ADMIN]),
  updateEmployeeAvailabilityController
);

// Assign appointment to employee
employeeRoutes.put(
  "/:id/assign/:appointmentId",
  authorizeRoles([Roles.ADMIN]),
  assignAppointmentToEmployeeController
);

// Get employee schedule - accessible by both admin and the employee themselves
employeeRoutes.get(
  "/:id/schedule",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  getEmployeeScheduleController
);

export default employeeRoutes;
