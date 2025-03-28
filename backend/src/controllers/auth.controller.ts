import {Request, Response} from "express"
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const jwt = req.jwt;
    if (!jwt) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failture`
      );
    }

    return res.redirect(
      `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=success&access_token=${jwt}`,
    );
  }
);
