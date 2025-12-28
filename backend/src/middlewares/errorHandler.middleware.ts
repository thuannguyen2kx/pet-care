import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/app-error";
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
      message: "Invalid JSON format. Please check your request body",
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
};
