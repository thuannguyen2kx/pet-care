import z from 'zod';

import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';
export const AdminDashboardStatSchema = z.object({
  employees: z.object({
    active: z.number(),
    total: z.number(),
  }),
  bookings: z.object({
    today: z.number(),
  }),
  services: z.object({
    total: z.number(),
    active: z.number(),
  }),
  revenue: z.object({
    thisMonth: z.number(),
    currency: z.string(),
    growthPercent: z.number().nullable(),
  }),
});

export const TopEmployeeSchema = z.object({
  id: mongoObjectIdSchema,
  fullName: z.string(),
  profilePicture: z.url().optional(),
  stats: z.object({
    rating: z.number(),
    completedBookings: z.number(),
    totalRevenue: z.number(),
  }),
});
export const ReportOverviewSchema = z.object({
  totalRevenue: z.number(),
  totalBookings: z.number(),
  completedBookings: z.number(),
  completionRate: z.number(),
  averageRating: z.number(),
  changes: z.object({
    revenue: z.number(),
    bookings: z.number(),
    completionRate: z.number(),
    averageRating: z.number(),
  }),
});
export const RevenueChartPointSchema = z.object({
  label: z.string(),
  revenue: z.number(),
  bookingCount: z.number(),
});
export const RevenueChartSummarySchema = z.object({
  totalRevenue: z.number(),
});
export const RevenueChartRangeSchema = z.object({
  from: z.date(),
  to: z.date(),
  groupBy: z.enum(['day', 'week', 'month']),
});
export const RevenueChartSchema = z.object({
  range: RevenueChartRangeSchema,
  points: z.array(RevenueChartPointSchema),
  summary: RevenueChartSummarySchema,
});

export const ReportServiceStatSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  bookingCount: z.number(),
  revenue: z.number(),
  revenueInMillion: z.number(),
});

export type AdminDashboardStat = z.infer<typeof AdminDashboardStatSchema>;
export type TopEmployee = z.infer<typeof TopEmployeeSchema>;
export type ReportOverview = z.infer<typeof ReportOverviewSchema>;
export type RevenueChart = z.infer<typeof RevenueChartSchema>;
export type RevenueChartPoint = z.infer<typeof RevenueChartPointSchema>;
export type RevenueChartSummary = z.infer<typeof RevenueChartSummarySchema>;
export type RevenueChartRange = z.infer<typeof RevenueChartRangeSchema>;
export type ReportServiceStat = z.infer<typeof ReportServiceStatSchema>;
