import z from 'zod';

import {
  AdminDashboardStatDtoSchema,
  ReportOverviewDtoSchema,
  reportServiceStatDtoSchema,
  revenueChartItemDtoSchema,
  TopEmployeeDtoSchema,
} from '@/features/report/domain/report.dto';
import { isoDateSchema } from '@/shared/lib/zod-primitives';

export const adminDashboardStatResponseSchema = z.object({
  data: AdminDashboardStatDtoSchema,
});

export const topEmployeeResponseSchema = z.object({
  data: z.array(TopEmployeeDtoSchema),
});

export const reportOverviewResponseSchema = z.object({
  data: ReportOverviewDtoSchema,
});

export const revenueChartResponseDtoSchema = z.object({
  range: z.object({
    from: z.string(),
    to: z.string(),
    groupBy: z.enum(['day', 'week', 'month']),
  }),
  data: z.array(revenueChartItemDtoSchema),
  summary: z.object({
    totalRevenue: z.number(),
  }),
});

export const reportServicesResponseSchema = z.object({
  range: z.object({
    from: isoDateSchema,
    to: isoDateSchema,
  }),
  data: z.array(reportServiceStatDtoSchema),
});

export type RevenueChartResponseDto = z.infer<typeof revenueChartResponseDtoSchema>;
