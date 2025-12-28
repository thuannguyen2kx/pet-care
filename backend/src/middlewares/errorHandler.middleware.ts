import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/app-error";
import { ZodError } from "zod";
export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
): any => {
  console.error(`[ERROR] ${req.method} ${req.path}`, {
    name: error?.name,
    message: error?.message,
    stack: error?.stack,
  });

  if (error instanceof SyntaxError) {
    return res.status(400).json({
      message:
        "Định dạng JSON không hợp lệ. Vui lòng kiểm tra nội dung yêu cầu của bạn.",
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }
  if (error instanceof ZodError) {
    const formattedErrors: Record<string, string> = {};

    error.errors.forEach((err) => {
      const field = err.path.join(".");
      if (!formattedErrors[field]) {
        formattedErrors[field] = err.message;
      }
    });

    return res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
      message: "Dữ liệu không hợp lệ",
      errors: formattedErrors,
    });
  }

  return res.status(500).json({
    message: "Lỗi máy chủ",
  });
};
