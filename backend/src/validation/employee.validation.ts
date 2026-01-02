import { z } from "zod";
// Create shift template
export const createShiftTemplateSchema = z.object({
  employeeId: z.string().min(1, "Mã nhân viên là bắt buộc"),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Thời gian không hợp lệ"),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Thời gian không hợp lệ"),
  effectiveFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày phải là YYYY-MM-DD"),
  effectiveTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

// Bulk create shifts (for weekly schedule)
export const bulkCreateShiftsSchema = z.object({
  employeeId: z.string().min(1),
  shifts: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
      endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    })
  ),
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  effectiveTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

// Create shift override
export const createShiftOverrideSchema = z.object({
  employeeId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  isWorking: z.boolean(),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  reason: z.string().max(500).optional(),
});

// Create break template
export const createBreakTemplateSchema = z.object({
  employeeId: z.string().min(1),
  dayOfWeek: z.number().min(0).max(6).optional(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  name: z.string().min(1).max(100),
  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  effectiveTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

// Update employee profile
export const updateEmployeeProfileSchema = z.object({
  specialties: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  experience: z.string().max(500).optional(),
  hourlyRate: z.number().min(0).optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  maxDailyBookings: z.number().min(1).max(20).optional(),
  isAcceptingBookings: z.boolean().optional(),
  vacationMode: z.boolean().optional(),
});
