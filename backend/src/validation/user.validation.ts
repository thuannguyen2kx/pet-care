import {z} from "zod"
import { StatusUser } from "../enums/status-user.enum";
export const userIdSchema = z.string().trim().min(1, {message: "user ID is required"})
export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(255).optional(),
  email: z.string().trim().email("Invalid email address").min(1).max(255).optional(),
  phoneNumber: z.string().trim().min(1).max(255).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

// Schema for filtering customers
export const getAllCustomersSchema = z.object({
  search: z.string().optional(),
  status: z.enum([StatusUser.ACTIVE, StatusUser.BLOCKED]).optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(10),
});

// Schema for changing user status
export const changeUserStatusSchema = z.object({
  status: z.enum([StatusUser.ACTIVE, StatusUser.BLOCKED], {
    required_error: "Status is required",
    invalid_type_error: "Status must be either ACTIVE or BLOCKED",
  }),
});