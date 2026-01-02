import { Router } from "express";
import {
  bulkCreateShiftsController,
  createBreakTemplateController,
  createShiftOverrideController,
  createShiftTemplateController,
  deleteShiftOverrideController,
  deleteShiftTemplateController,
  getEmployeeByIdController,
  getEmployeeScheduleController,
  getEmployeesController,
  getEmployeeShiftsController,
  getShiftOverridesController,
  updateBreakTemplateController,
  updateEmployeeProfileController,
  updateShiftOverrideController,
  updateShiftTemplateController,
} from "../controllers/employee.controller";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";

const router = Router();

// Employee
router.get("/", getEmployeesController);
router.get("/:id", getEmployeeByIdController);
router.put("/:id/profile", updateEmployeeProfileController);

// Schedule
router.get("/:id/schedule", getEmployeeScheduleController);

// Shifts
router.post(
  "/:id/shifts",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  createShiftTemplateController
);
router.post(
  "/:id/shifts/bulk",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  bulkCreateShiftsController
);
router.get("/:id/shifts", getEmployeeShiftsController);
router.put(
  "/shifts/:id",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  updateShiftTemplateController
);
router.delete(
  "/shifts/:id",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  deleteShiftTemplateController
);

// Overrides
router.post(
  "/:id/overrides",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  createShiftOverrideController
);
router.get("/:id/overrides", getShiftOverridesController);
router.put(
  "/overrides/:id",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  updateShiftOverrideController
);
router.delete(
  "/overrides/:id",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  deleteShiftOverrideController
);
// Breaks
router.post(
  "/:id/breaks",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  createBreakTemplateController
);
router.put(
  "/breaks/:id",
  authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]),
  updateBreakTemplateController
);
router.delete("/breaks/:id", authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]));

export default router;
