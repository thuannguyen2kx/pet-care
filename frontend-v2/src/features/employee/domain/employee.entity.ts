import z from 'zod';

import { isoDateSchema, time24hSchema } from '@/shared/lib/zod-primitives';

export const EmployeeDashboardStartSchema = z.object({
  rating: z.object({
    average: z.number(),
    totalReviews: z.number(),
  }),
  todayBookings: z.object({
    total: z.number(),
    pending: z.number(),
  }),
  completedServices: z.object({
    total: z.number(),
    thisMonth: z.number(),
  }),
  revenue: z.object({
    thisMonth: z.number(),
    currency: z.string(),
  }),
});

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

  overwrite: z.boolean().optional(),
  reason: z.string().optional(),
});

export type EmployeeDashboardStart = z.infer<typeof EmployeeDashboardStartSchema>;
export type EmployeeSchedule = z.infer<typeof EmployeeScheduleSchema>;
