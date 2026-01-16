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

export type AdminDashboardStat = z.infer<typeof AdminDashboardStatSchema>;
export type TopEmployee = z.infer<typeof TopEmployeeSchema>;
