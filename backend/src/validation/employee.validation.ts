import { z } from "zod";
import { Specialty  } from "../enums/employee.enum";
import { StatusUser } from "../enums/status-user.enum";
import { ServiceType } from "../models/appointment.model";

// Employee ID validation
export const employeeIdSchema = z.string().min(1, {
  message: "ID nhân viên không được để trống",
});

// Appointment ID validation
export const appointmentIdSchema = z.string().min(1, {
  message: "ID cuộc hẹn không được để trống",
});

// Validate specialties
const specialtiesSchema = z.array(
  z.enum([
    Specialty.BATHING,
    Specialty.HAIRCUT,
    Specialty.SKINCARE,
    Specialty.NAIL_TRIMMING,
    Specialty.MASSAGE,
    Specialty.AROMATHERAPY,
    Specialty.HERBAL_BATH,
    Specialty.SKIN_TREATMENT,
    Specialty.HEALTH_CHECK,
    Specialty.VACCINATION,
    Specialty.POST_VACCINE_CARE,
    Specialty.NUTRITION_ADVICE
  ])
).min(1, {
  message: "Vui lòng chọn ít nhất một chuyên môn",
});

// Validate workdays
const workDaysSchema = z.array(
  z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ])
).min(1, {
  message: "Vui lòng chọn ít nhất một ngày làm việc",
});

// Validate time format
const timeFormatSchema = z
  .string()
  .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Thời gian phải có định dạng HH:MM (ví dụ: 09:00)",
  })
  .optional();

// Get Employees schema 
export const getEmployeesSchema = z.object({
  status: z
    .enum([StatusUser.ACTIVE, StatusUser.INACTIVE, StatusUser.BLOCKED])
    .optional(),
  specialty: z.string() 
    .optional(),
});
// Create employee schema
export const createEmployeeSchema = z.object({
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
  fullName: z.string().min(2, {
    message: "Tên đầy đủ phải có ít nhất 2 ký tự",
  }),
  phoneNumber: z.string().min(10, {
    message: "Số điện thoại không hợp lệ",
  }),
  specialties: specialtiesSchema,
  workDays: workDaysSchema,
  workHoursStart: timeFormatSchema,
  workHoursEnd: timeFormatSchema,
});

// Update employee schema
export const updateEmployeeSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email không hợp lệ",
    })
    .optional(),
  fullName: z
    .string()
    .min(2, {
      message: "Tên đầy đủ phải có ít nhất 2 ký tự",
    })
    .optional(),
  phoneNumber: z
    .string()
    .min(10, {
      message: "Số điện thoại không hợp lệ",
    })
    .optional(),
  specialties: specialtiesSchema.optional(),
  workDays: workDaysSchema.optional(),
  workHoursStart: timeFormatSchema,
  workHoursEnd: timeFormatSchema,
  status: z
    .enum([StatusUser.ACTIVE, StatusUser.INACTIVE, StatusUser.BLOCKED])
    .optional(),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
});

// Availability update schema
export const availabilitySchema = z.object({
  workDays: workDaysSchema.optional(),
  workHoursStart: timeFormatSchema,
  workHoursEnd: timeFormatSchema,
  vacationStart: z.string().datetime().optional(),
  vacationEnd: z.string().datetime().optional(),
}).refine(
  (data) => {
    // If one vacation date is provided, both must be provided
    if (data.vacationStart && !data.vacationEnd) return false;
    if (!data.vacationStart && data.vacationEnd) return false;
    
    // If both are provided, end must be after start
    if (data.vacationStart && data.vacationEnd) {
      const start = new Date(data.vacationStart);
      const end = new Date(data.vacationEnd);
      return end > start;
    }
    
    return true;
  },
  {
    message: "Ngày kết thúc nghỉ phép phải sau ngày bắt đầu",
    path: ["vacationEnd"],
  }
);
// Schema for getting available employees for a service and timeslot
export const getAvailableEmployeesSchema = z.object({
  serviceId: z.string().min(1, { message: "ID dịch vụ là bắt buộc" }),
  serviceType: z.nativeEnum(ServiceType, {
    errorMap: () => ({ message: "Loại dịch vụ không hợp lệ" }),
  }),
  timeSlot: z.string().optional(),
  date: z.string().optional(),
});