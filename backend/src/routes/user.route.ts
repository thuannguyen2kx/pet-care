import { Router } from "express";
import {
  changeUserRoleController,
  changeUserStatusController,
  createEmployeeController,
  deleteProfilePictureController,
  deleteUserController,
  getCurrentUserController,
  getCustomerListController,
  getEmployeeListController,
  getProfileByIdController,
  getUserByIdController,
  updateAddressController,
  updateEmployeeController,
  updatePreferencesController,
  updateProfileController,
  updateProfilePictureController,
} from "../controllers/user.controller";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";

const userRoutes = Router();

userRoutes.get("/profile", getCurrentUserController);
userRoutes.put("/profile", updateProfileController);
userRoutes.get("/profile/:id", getProfileByIdController);

userRoutes.put("/address", updateAddressController);
userRoutes.put("/preferences", updatePreferencesController);

userRoutes.put("/profile-picture", updateProfilePictureController);
userRoutes.delete("/profile-picture", deleteProfilePictureController);

userRoutes.get("/employees", getEmployeeListController);

// ===== ADMIN ONLY ROUTES =====

userRoutes.get(
  "/admin/users/:id",
  authorizeRoles([Roles.ADMIN]),
  getUserByIdController
);

userRoutes.patch(
  "/admin/users/:id/status",
  authorizeRoles([Roles.ADMIN]),
  changeUserStatusController
);

userRoutes.patch(
  "/admin/users/:id/role",
  authorizeRoles([Roles.ADMIN]),
  changeUserRoleController
);

userRoutes.delete(
  "/admin/users/:id",
  authorizeRoles([Roles.ADMIN]),
  deleteUserController
);

userRoutes.post(
  "/admin/employees",
  authorizeRoles([Roles.ADMIN]),
  createEmployeeController
);

userRoutes.put(
  "/admin/employees/:id",
  authorizeRoles([Roles.ADMIN]),
  updateEmployeeController
);

userRoutes.get(
  "/admin/employees",
  authorizeRoles([Roles.ADMIN]),
  getEmployeeListController
);

userRoutes.get(
  "/admin/customers",
  authorizeRoles([Roles.ADMIN]),
  getCustomerListController
);
export default userRoutes;
