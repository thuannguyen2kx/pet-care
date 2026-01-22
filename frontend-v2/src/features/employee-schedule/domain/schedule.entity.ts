import { z } from 'zod';

import { EmployeeSpecialtySchema } from '@/features/employee/domain/employee.entity';
import type { CalendarDay } from '@/features/employee-schedule/domain/schedule.lib';
import { isoDateSchema, mongoObjectIdSchema, time24hSchema } from '@/shared/lib/zod-primitives';

export const EmployeeScheduleSchema = z.object({
  date: isoDateSchema,
  dayOfWeek: z.number().min(0).max(6),
  isWorking: z.boolean(),

  startTime: time24hSchema.optional(),
  endTime: time24hSchema.optional(),

  breaks: z.array(
    z.object({
      name: z.string(),
      startTime: time24hSchema,
      endTime: time24hSchema,
    }),
  ),

  override: z
    .object({
      reason: z.string().optional(),
    })
    .optional(),
});

export const EmployeeScheduleCalendarSchema = z.object({
  date: z.date(),
  dayOfWeek: z.number().min(0).max(6),
  isWorking: z.boolean(),

  startTime: time24hSchema.optional(),
  endTime: time24hSchema.optional(),

  breaks: z.array(
    z.object({
      name: z.string(),
      startTime: time24hSchema,
      endTime: time24hSchema,
    }),
  ),

  override: z
    .object({
      reason: z.string().optional(),
    })
    .optional(),
});

export const EmployeeWeekScheduleSchema = z.object({
  employeeId: mongoObjectIdSchema,
  fullName: z.string(),
  email: z.string(),
  profilePicture: z.string().nullable(),
  specialties: z.array(EmployeeSpecialtySchema),

  workHours: z.object({
    start: time24hSchema,
    end: time24hSchema,
  }),
  days: z.array(EmployeeScheduleSchema),
});

export const ShiftTemplateSchema = z.object({
  id: mongoObjectIdSchema,
  employeeId: mongoObjectIdSchema,
  dayOfWeek: z.number().min(0).max(6),
  startTime: time24hSchema,
  endTime: time24hSchema,
  effectiveFrom: z.date(),
  effectiveTo: z.date().optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ShiftOverrideSchmema = z.object({
  id: mongoObjectIdSchema,
  employeeId: mongoObjectIdSchema,
  date: isoDateSchema,
  isWorking: z.boolean(),
  reason: z.string(),
  createdBy: z
    .object({
      id: mongoObjectIdSchema,
      fullName: z.string(),
    })
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const BreakTemplateSchema = z.object({
  id: mongoObjectIdSchema,
  employeeId: mongoObjectIdSchema,
  dayOfWeek: z.number().min(0).max(6).optional(),
  name: z.string(),
  startTime: time24hSchema,
  endTime: time24hSchema,
  effectiveFrom: z.date(),
  effectiveTo: z.date().optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
// ===================
// Types
// ===================
export type EmployeeSchedule = z.infer<typeof EmployeeScheduleSchema>;
export type EmployeeWeekSchedule = z.infer<typeof EmployeeWeekScheduleSchema>;
export type EmployeeScheduleCalendar = z.infer<typeof EmployeeScheduleCalendarSchema>;
export type ShiftTemplate = z.infer<typeof ShiftTemplateSchema>;
export type ShiftOverride = z.infer<typeof ShiftOverrideSchmema>;
export type BreakTemplate = z.infer<typeof BreakTemplateSchema>;
export type CalendarDayWithSchedule = CalendarDay & {
  schedule?: EmployeeScheduleCalendar;
};
