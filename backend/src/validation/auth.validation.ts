import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Yêu cầu họ và tên ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu có ít nhất 1 ký tự viết hoa")
    .regex(/[a-z]/, "Mật khâu phải có ít nhất 1 ký tự viết thường")
    .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 số"),
  phoneNumber: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Yêu cầu cung cấp mật khẩu hiện tại"),
  newPassword: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một ký tự viết hoa")
    .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một ký tự viết thường")
    .regex(/[0-9]/, "Mật khẩu phải  chứa ít nhất một số"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token là bắt buộc"),
  newPassword: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải có ít nhất một ký tự viết hoa")
    .regex(/[a-z]/, "Mật khẩu phải có ít nhất một ký tự viết thường")
    .regex(/[0-9]/, "Mật khẩu phải có ít nhất một số"),
});
