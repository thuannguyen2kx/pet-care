import { Router } from "express";
import passport from "passport";
import {
  googleLoginCallback,
  loginUserController,
  logoutUserController,
  registerUserController,
} from "../controllers/auth.controller";
import { config } from "../config/app.config";

const authRoutes = Router();

const failureUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failture`;

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginUserController);
authRoutes.post("/logout", logoutUserController);

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

export default authRoutes;
