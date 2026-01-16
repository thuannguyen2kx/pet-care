import z from 'zod';

export const TopEmployeeQueryDtoSchema = z.object({
  limit: z.coerce.number().optional(),
  sortBy: z.enum(['rating', 'revenue', 'completed']).optional(),
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

export type AdminDashboardStatDto = z.infer<typeof AdminDashboardStatDtoSchema>;
export type TopEmployeeQueryDto = z.infer<typeof TopEmployeeQueryDtoSchema>;
export type TopEmployeeDto = z.infer<typeof TopEmployeeDtoSchema>;
