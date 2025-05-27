import { NextFunction, Request, Response } from "express";
import passport from "passport";

import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { registerUserService } from "../services/auth.service";
import { HTTPSTATUS } from "../config/http.config";
import { signJwtToken } from "../utils/jw";

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const jwt = req.jwt;
    if (!jwt) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failture`
      );
    }

    return res.redirect(
      `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=success&access_token=${jwt}`
    );
  }
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({ ...req.body });

    await registerUserService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
    });
  }
);

export const loginUserController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (
        error: Error | null,
        user: Express.User,
        info: { message: string } | undefined
      ) => {
        if (error) {
          return next(error);
        }
        if (!user) {
          return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: info?.message || "Invalid email or password",
          });
        }
        if (user.status === "BLOCKED") {
          return res.status(HTTPSTATUS.FORBIDDEN).json({
            message: "Your account is blocked. Please contact support.",
          });
        }
        const access_token = signJwtToken({
          userId: user._id,
          role: user.role,
        });
        return res.status(HTTPSTATUS.OK).json({
          message: "User login successfully",
          access_token,
          user,
        });
      }
    )(req, res, next);
  }
);

export const logoutUserController = asyncHandler(
  async (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        console.log("Logout error", err);
        return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
          error: "Failed to log out",
        });
      }
    });

    req.session = null;
    return res.status(HTTPSTATUS.OK).json({
      message: "Logged out successfully",
    });
  }
);
