import { Router } from "express";
import {
  getCurrentUserController,
  updateProfileController,
  updateProfilePictureController,
} from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/current", getCurrentUserController);

userRoutes.put("/profile", updateProfileController);
userRoutes.put("/profile/picture", updateProfilePictureController);
userRoutes.get("/profile/:id", getCurrentUserController);

export default userRoutes;
