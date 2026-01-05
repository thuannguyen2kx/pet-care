import { z } from 'zod';

export const createShiftTemplateInputSchema = z.object({
  dayOfWeek: z.coerce.number().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Thời gian không hợp lệ'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Thời gian không hợp lệ'),
  effectiveFrom: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
    message: 'Ngày bắt đầu không hợp lệ',
  }),

  effectiveTo: z.coerce
    .date()
    .optional()
    .refine((d) => !d || !isNaN(d.getTime()), {
      message: 'Ngày kết thúc không hợp lệ',
    }),
});
export type CreateShiftTemplateInput = z.infer<typeof createShiftTemplateInputSchema>;
export type CreateShiftTemplatePayload = Omit<
  CreateShiftTemplateInput,
  'effectiveFrom' | 'effectiveTo'
> & {
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo?: string; // YYYY-MM-DD
};
// Bulk create shifts (for weekly schedule)
const dayOfWeekEnum = z.enum(['0', '1', '2', '3', '4', '5', '6']);
export const bulkCreateShiftsInputSchema = z
  .object({
    days: z.record(
      dayOfWeekEnum, // dayOfWeek key
      z.object({
        isWorking: z.boolean(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
      }),
    ),

    effectiveFrom: z.date(),
    effectiveTo: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    const enabledDays = Object.entries(data.days).filter(([_, day]) => day.isWorking);

    if (enabledDays.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['days'],
        message: 'Phải chọn ít nhất một ngày làm việc',
      });
    }

    enabledDays.forEach(([day, shift]) => {
      if (!shift.startTime || !shift.endTime) {
        ctx.addIssue({
          code: 'custom',
          path: ['days', day],
          message: 'Cần chọn giờ làm việc',
        });
        return;
      }

      if (shift.endTime <= shift.startTime) {
        ctx.addIssue({
          code: 'custom',
          path: ['days', day, 'endTime'],
          message: 'Giờ kết thúc phải sau giờ bắt đầu',
        });
      }
    });

    if (data.effectiveTo && data.effectiveTo < data.effectiveFrom) {
      ctx.addIssue({
        code: 'custom',
        path: ['effectiveTo'],
        message: 'Ngày kết thúc phải sau ngày bắt đầu',
      });
    }
  });

export type BulkCreateShiftsInput = z.infer<typeof bulkCreateShiftsInputSchema>;

export type BulkCreateShiftsPayload = {
  employeeId: string;
  shifts: {
    dayOfWeek: number; // 0–6
    startTime: string; // HH:mm
    endTime: string; // HH:mm
  }[];
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo?: string; // YYYY-MM-DD
};

export const replaceShiftTemplateInputSchema = z.object({
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Thời gian không hợp lệ'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Thời gian không hợp lệ'),
  effectiveFrom: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
    message: 'Ngày bắt đầu không hợp lệ',
  }),
});
export type TReplaceShiftTemplateInput = z.infer<typeof replaceShiftTemplateInputSchema>;
export type TReplaceShiftTemplatePayload = {
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  effectiveFrom: string; // YYYY-MM-DD
};

export const disableShiftTemplateSchema = z.object({
  effectiveTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type TDisableShiftTemplateInput = z.infer<typeof disableShiftTemplateSchema>;
export type TDisableShiftTemplatePayload = {
  effectiveTo: string;
};
