import { z } from "zod";
import mongoose from "mongoose";

export const createShiftTemplateSchema = z
  .object({
    employeeId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "employeeId không hợp lệ",
    }),

    dayOfWeek: z.number().int().min(0).max(6),

    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),

    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),

    effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

    effectiveTo: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.endTime <= data.startTime) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "Thời gian kết thúc phải sau thời gian bắt đầu",
      });
    }

    if (data.effectiveTo && data.effectiveTo < data.effectiveFrom) {
      ctx.addIssue({
        code: "custom",
        path: ["effectiveTo"],
        message: "effectiveTo phải sau effectiveFrom",
      });
    }
  });

// Bulk create shifts (for weekly schedule)
export const bulkCreateShiftsSchema = z
  .object({
    employeeId: z.string().min(1),

    shifts: z
      .array(
        z.object({
          dayOfWeek: z.number().int().min(0).max(6),
          startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
          endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
        })
      )
      .min(1, "Phải có ít nhất một ca làm"),

    effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

    effectiveTo: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
  })
  .superRefine((data, ctx) => {
    // effective range
    if (data.effectiveTo && data.effectiveTo < data.effectiveFrom) {
      ctx.addIssue({
        path: ["effectiveTo"],
        message: "Ngày kết thúc phải sau ngày bắt đầu",
        code: z.ZodIssueCode.custom,
      });
    }

    // shift time logic
    data.shifts.forEach((shift, index) => {
      if (shift.endTime <= shift.startTime) {
        ctx.addIssue({
          path: ["shifts", index, "endTime"],
          message: "Giờ kết thúc phải sau giờ bắt đầu",
          code: z.ZodIssueCode.custom,
        });
      }
    });

    // duplicate dayOfWeek
    const days = data.shifts.map((s) => s.dayOfWeek);
    if (new Set(days).size !== days.length) {
      ctx.addIssue({
        path: ["shifts"],
        message: "Không được có nhiều ca trong cùng một ngày",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const replaceShiftTemplateSchema = z.object({
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),

  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),

  effectiveFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export const disableShiftTemplateSchema = z.object({
  effectiveTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
// Create shift override
export const createShiftOverrideSchema = z
  .object({
    employeeId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "employeeId không hợp lệ",
    }),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày phải là YYYY-MM-DD"),

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
  })
  .superRefine((data, ctx) => {
    if (data.isWorking) {
      if (!data.startTime || !data.endTime) {
        ctx.addIssue({
          path: ["startTime"],
          message: "Phải có giờ làm khi isWorking = true",
          code: z.ZodIssueCode.custom,
        });
      }

      if (data.startTime && data.endTime && data.endTime <= data.startTime) {
        ctx.addIssue({
          path: ["endTime"],
          message: "Giờ kết thúc phải sau giờ bắt đầu",
          code: z.ZodIssueCode.custom,
        });
      }
    } else {
      if (data.startTime || data.endTime) {
        ctx.addIssue({
          path: ["startTime"],
          message: "Không được truyền giờ khi isWorking = false",
          code: z.ZodIssueCode.custom,
        });
      }
    }
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
