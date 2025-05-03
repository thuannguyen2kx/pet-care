import { Router } from "express";
import {
  changeCustomerStatusController,
  getAllCustomersController,
  getCurrentUserController,
  getCustomerByIdController,
  getProfileByController,
  updateProfileController,
  updateProfilePictureController,
} from "../controllers/user.controller";
import { authorizeRoles } from "../middlewares/auth.middleware";
import { Roles } from "../enums/role.enum";

const userRoutes = Router();

userRoutes.get("/current", getCurrentUserController);

userRoutes.put("/profile", updateProfileController);
userRoutes.put("/profile/picture", updateProfilePictureController);
userRoutes.get("/profile/:id", getProfileByController);

userRoutes.get("/", authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]), getAllCustomersController);
userRoutes.get("/:id",authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]), getCustomerByIdController);
userRoutes.patch("/:id/status",authorizeRoles([Roles.ADMIN, Roles.EMPLOYEE]), changeCustomerStatusController);

export default userRoutes;
