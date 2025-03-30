import {z} from "zod"
export const updateProfileInfoSchema = z.object({
  fullName: z.string().trim().min(1, {
    message: "Vui lòng nhập tên đầy đủ",
  }).optional(),
  phoneNumber: z.string().trim().min(1, {
    message: "Vui lòng nhập số điện thoại",
  }).optional(),
  email: z.string().trim().email("Email không hợp lệ").min(1, {
    message: "Vui lòng nhập email",
  }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
})