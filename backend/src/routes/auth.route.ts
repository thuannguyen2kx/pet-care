import { Router } from "express";
import passport from "passport";
import {
  ChangePasswordController,
  fogotPasswordController,
  getMeController,
  googleLoginCallback,
  loginUserController,
  logoutUserController,
  registerUserController,
  resetPasswordController,
  verifyEmailController,
} from "../controllers/auth.controller";
import { config } from "../config/app.config";
import { passportAuthenticateJWT } from "../config/passport.config";

const authRoutes = Router();

const failureUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failture`;

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginUserController);
authRoutes.post("/forgot-password", fogotPasswordController);
authRoutes.post("/reset-password", resetPasswordController);
authRoutes.post("/verify-email", verifyEmailController);

authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failureUrl,
    session: false,
  }),
  googleLoginCallback
);
authRoutes.post(
  "/change-password",
  passportAuthenticateJWT,
  ChangePasswordController
);
authRoutes.get("/me", passportAuthenticateJWT, getMeController);
authRoutes.post("/logout", logoutUserController);

export default authRoutes;
