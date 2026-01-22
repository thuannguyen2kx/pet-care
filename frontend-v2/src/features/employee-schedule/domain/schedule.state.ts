import { z } from 'zod';

import { isoDateSchema, mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const DayOfWeekEnum = z.enum(['0', '1', '2', '3', '4', '5', '6']);

export const CreateShiftTemplateSchema = z.object({
  employeeId: mongoObjectIdSchema,
  dayOfWeek: z.coerce.number().min(0).max(6),
  startTime: z.string().regex(TIME_REGEX, 'Thời gian không hợp lệ'),
  endTime: z.string().regex(TIME_REGEX, 'Thời gian không hợp lệ'),
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

export const BulkCreateShiftsTemplateSchema = z
  .object({
    employeeId: mongoObjectIdSchema,
    days: z.record(
      DayOfWeekEnum,
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

export const ReplaceShiftTemplateSchema = z.object({
  shiftId: mongoObjectIdSchema,
  startTime: z.string().regex(TIME_REGEX, 'Thời gian không hợp lệ'),
  endTime: z.string().regex(TIME_REGEX, 'Thời gian không hợp lệ'),
  effectiveFrom: z.coerce.date().refine((d) => !isNaN(d.getTime()), {
    message: 'Ngày bắt đầu không hợp lệ',
  }),
});
export const DisableShiftTemplateSchema = z.object({
  shiftId: mongoObjectIdSchema,
  effectiveTo: z.date(),
});

export const CreateShiftOverrideSchema = z
  .object({
    employeeId: mongoObjectIdSchema,
    date: z.date().refine((date) => date !== null, {
      message: 'Vui lòng chọn ngày',
    }),

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
          path: ['startTime'],
          message: 'Phải có giờ làm khi isWorking = true',
          code: 'custom',
        });
      }

      if (data.startTime && data.endTime && data.endTime <= data.startTime) {
        ctx.addIssue({
          path: ['endTime'],
          message: 'Giờ kết thúc phải sau giờ bắt đầu',
          code: 'custom',
        });
      }
    }
  });
export const CreateBreakTemplateSchema = z.discriminatedUnion('breakType', [
  z.object({
    employeeId: mongoObjectIdSchema,
    breakType: z.literal('WEEKLY'),
    dayOfWeek: z.number().min(0).max(6),
    name: z.string().min(1).max(100),
    startTime: z.string().regex(TIME_REGEX),
    endTime: z.string().regex(TIME_REGEX),
    effectiveFrom: z.date(),
    effectiveTo: z.date().optional(),
  }),

  z.object({
    employeeId: mongoObjectIdSchema,
    breakType: z.literal('DATE'),
    name: z.string().min(1).max(100),
    startTime: z.string().regex(TIME_REGEX),
    endTime: z.string().regex(TIME_REGEX),
    effectiveFrom: z.date(),
    effectiveTo: z.date().optional(),
  }),
]);
export const EmployeeScheduleQuerySchema = z.object({
  employeeId: mongoObjectIdSchema.optional(),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
});
// =============
// Types
// =============

export type DayOfWeek = z.infer<typeof DayOfWeekEnum>;
export type CreateShiftTemplate = z.infer<typeof CreateShiftTemplateSchema>;
export type BulkCreateShiftsTemplate = z.infer<typeof BulkCreateShiftsTemplateSchema>;
export type ReplaceShiftTemplate = z.infer<typeof ReplaceShiftTemplateSchema>;
export type DisableShiftTemplate = z.infer<typeof DisableShiftTemplateSchema>;
export type CreateShiftOverride = z.infer<typeof CreateShiftOverrideSchema>;
export type CreateBreakTemplate = z.infer<typeof CreateBreakTemplateSchema>;
export type EmployeeScheduleQuery = z.infer<typeof EmployeeScheduleQuerySchema>;
