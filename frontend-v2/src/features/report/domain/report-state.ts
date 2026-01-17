import z from 'zod';

import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

export const TopEmployeeQuerySchema = z.object({
  limit: z.coerce.number().optional(),
  sortBy: z.enum(['rating', 'revenue', 'completed']).optional(),
});

export const ReportOverviewQuerySchema = z.object({
  timeRange: z.enum(['week', 'month', 'quarter', 'year']).optional().default('month'),
});

export const RevenueChartQuerySchema = z.object({
  preset: z.enum(['7d', '30d', 'quarter', 'year']).default('30d'),
  groupBy: z.enum(['day', 'week', 'month']).default('day'),
  employeeId: mongoObjectIdSchema.optional(),
});
export const ReportServicesQuerySchema = z.object({
  preset: z.enum(['7d', '30d', 'quarter', 'year']).default('7d'),
  limit: z.number().optional().default(5),
  employeeId: mongoObjectIdSchema.optional(),
  sortBy: z.enum(['bookingCount', 'revenue']).optional(),
});

export type TopEmployeeQuery = z.infer<typeof TopEmployeeQuerySchema>;
export type ReportOverviewQuery = z.infer<typeof ReportOverviewQuerySchema>;
export type RevenueChartQuery = z.infer<typeof RevenueChartQuerySchema>;
export type ReportServicesQuery = z.infer<typeof ReportServicesQuerySchema>;
