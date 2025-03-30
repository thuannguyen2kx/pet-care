import {z} from "zod"
export const userIdSchema = z.string().trim().min(1, {message: "user ID is required"})
export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(255).optional(),
  email: z.string().trim().email("Invalid email address").min(1).max(255).optional(),
  phoneNumber: z.string().trim().min(1).max(255).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});