import { NextFunction, Request, Response } from "express";
import passport from "passport";

import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validation/auth.validation";
import {
  changePasswordService,
  forgotPasswordService,
  getMeService,
  registerUserService,
  resetPasswordService,
  verifyEmailService,
} from "../services/auth.service";
import { HTTPSTATUS } from "../config/http.config";
import { signJwtToken } from "../utils/jw";
import { UserStatus } from "../enums/status-user.enum";
import { BadRequestException } from "../utils/app-error";

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
      message: "Tạo tài khoản thành công",
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
            message: info?.message || "",
          });
        }
        if (user.status === UserStatus.INACTIVE) {
          return res.status(HTTPSTATUS.FORBIDDEN).json({
            message:
              "Tài khoản của bạn đã ngừng hoạt động. Vui lòng liên hệ với quản trị viên để được hổ trợ",
          });
        }
        const access_token = signJwtToken({
          userId: user._id,
          role: user.role,
        });
        return res.status(HTTPSTATUS.OK).json({
          message: "Đăng nhập tài khoản thành công",
          data: {
            access_token,
            user,
          },
        });
      }
    )(req, res, next);
  }
);

export const logoutUserController = asyncHandler(
  async (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        console.log("Logout Error", err);
        return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
          error: "Đăng xuất tài khoản thất bại",
        });
      }
    });

    req.session = null;
    return res.status(HTTPSTATUS.OK).json({
      message: "Đăng xuất tài khoản thành công",
    });
  }
);

export const ChangePasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { currentPassword, newPassword } = changePasswordSchema.parse(
      req.body
    );

    await changePasswordService(userId, currentPassword, newPassword);

    return res.status(HTTPSTATUS.OK).json({
      message: "Thay đổi mật khẩu thành công",
    });
  }
);

export const fogotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = forgotPasswordSchema.parse(req.body);

    const result = await forgotPasswordService(email);

    return res.status(HTTPSTATUS.OK).json(result);
  }
);

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);

    await resetPasswordService(token, newPassword);

    return res.status(HTTPSTATUS.OK).json({
      message: "Đặt lại mật khẩu thành công",
    });
  }
);

export const verifyEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      throw new BadRequestException("Verification token is required");
    }

    await verifyEmailService(token);

    return res.status(HTTPSTATUS.OK).json({
      message: "Email verified successfully",
    });
  }
);

export const getMeController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const { user } = await getMeService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Lấy thông tin người dùng thành công",
      data: { user },
    });
  }
);
