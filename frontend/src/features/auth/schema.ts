import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ").min(1, {
    message: "Vui lòng nhập email",
  }),
  password: z.string().trim().min(1, {
    message: "Vui lòng nhập mật khẩu",
  }),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, {
      message: "Tên đầy đủ của bạn",
    }),
    email: z.string().trim().email("Email không hợp lệ").min(1, {
      message: "Vui lòng điền email",
    }),
    password: z.string().trim().min(1, {
      message: "Vui lòng nhập mật khẩu",
    }),
    confirmPassword: z.string().trim().min(1, {
      message: "Vui lòng xác nhận lại mật khẩu",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu chưa chính xác",
    path: ["confirmPassword"],
  });
