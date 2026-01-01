import { z } from "zod";
import { Roles } from "../enums/role.enum";
import { Gender, UserStatus } from "../enums/status-user.enum";

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phoneNumber: z.string().optional(),
  gender: z.enum(Object.values(Gender) as [string, ...string[]]).optional(),
  dateOfBirth: z.string().optional(),
});

export const updateAddressSchema = z.object({
  province: z.string().min(1, "Tỉnh/thành phố là bắt buộc"),
  ward: z.string().min(1, "Phường/xã là bắt buộc"),
});

export const updatePreferencesSchema = z.object({
  preferredEmployeeId: z.string().optional(),
  communicationPreferences: z
    .object({
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
      push: z.boolean().optional(),
    })
    .optional(),
});

export const userIdSchema = z.string().min(1, "Mã người dùng là bắt buộc");

export const getAllUsersSchema = z.object({
  search: z.string().optional(),
  role: z.enum(Object.values(Roles) as [string, ...string[]]).optional(),
  status: z.enum(Object.values(UserStatus) as [string, ...string[]]).optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export const createEmployeeSchema = z.object({
  fullName: z.string().min(2, "Yêu cầu họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().min(1, "Yêu cầu số điện thoại"),
  specialties: z.array(z.string()).min(1, "Yêu cầu ít nhất 1 chuyên môn"),
  hourlyRate: z.number().positive().optional(),
  department: z.string().optional(),
});

export const updateEmployeeSchema = z.object({
  fullName: z.string().min(2).optional(),
  phoneNumber: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  hourlyRate: z.number().positive().optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  department: z.string().optional(),
  isAcceptingBookings: z.boolean().optional(),
  maxDailyBookings: z.number().positive().optional(),
  vacationMode: z.boolean().optional(),
});

export const changeUserStatusSchema = z.object({
  status: z.enum(Object.values(UserStatus) as [string, ...string[]]),
});

export const changeUserRoleSchema = z.object({
  role: z.enum(Object.values(Roles) as [string, ...string[]]),
});
