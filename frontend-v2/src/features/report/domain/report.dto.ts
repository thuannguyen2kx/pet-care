import z from 'zod';

import { isoDateSchema, mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

export const TopEmployeeQueryDtoSchema = z.object({
  limit: z.coerce.number().optional(),
  sortBy: z.enum(['rating', 'revenue', 'completed']).optional(),
});
export const ReportOverviewQueryDtoSchema = z.object({
  timeRange: z.enum(['week', 'month', 'quarter', 'year']).optional(),
});
export const RevenueChartQueryDtoSchema = z.object({
  from: isoDateSchema,
  to: isoDateSchema,
  groupBy: z.enum(['day', 'week', 'month']).default('day'),
  employeeId: mongoObjectIdSchema.optional(),
});

export const ReportServicesQueryDtoSchema = z.object({
  from: isoDateSchema,
  to: isoDateSchema,
  limit: z.number().optional(),
  employeeId: mongoObjectIdSchema.optional(),
  sortBy: z.enum(['bookingCount', 'revenue']).optional(),
});

export const AdminDashboardStatDtoSchema = z.object({
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

export const TopEmployeeDtoSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  profilePicture: z.object({
    url: z.url().nullable(),
    publicId: z.string().nullable(),
  }),
  stats: z.object({
    rating: z.number(),
    completedBookings: z.number(),
    totalRevenue: z.number(),
  }),
});

export const ReportOverviewDtoSchema = z.object({
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

export const revenueChartItemDtoSchema = z.object({
  label: z.string(),
  revenue: z.number(),
  bookingCount: z.number(),
});

export const reportServiceStatDtoSchema = z.object({
  _id: mongoObjectIdSchema,
  name: z.string(),
  category: z.string(),
  bookingCount: z.number(),
  revenue: z.number(),
});

export type AdminDashboardStatDto = z.infer<typeof AdminDashboardStatDtoSchema>;
export type TopEmployeeQueryDto = z.infer<typeof TopEmployeeQueryDtoSchema>;
export type TopEmployeeDto = z.infer<typeof TopEmployeeDtoSchema>;
export type ReportOverviewQueryDto = z.infer<typeof ReportOverviewQueryDtoSchema>;
export type ReportOverviewDto = z.infer<typeof ReportOverviewDtoSchema>;
export type RevenueChartQueryDto = z.infer<typeof RevenueChartQueryDtoSchema>;
export type RevenueChartItemDto = z.infer<typeof revenueChartItemDtoSchema>;
export type ReportServicesQueryDto = z.infer<typeof ReportServicesQueryDtoSchema>;
export type ReportServiceStatDto = z.infer<typeof reportServiceStatDtoSchema>;
