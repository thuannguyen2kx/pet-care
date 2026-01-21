import z from 'zod';

import { mongoObjectIdSchema, time24hSchema } from '@/shared/lib/zod-primitives';

export const EmployeeSpecialtyDtoSchema = z.enum([
  'GROOMING',
  'SPA',
  'HEALTHCARE',
  'TRAINING',
  'BOARDING',
]);

export const EmployeeInfoDtoSchema = z.object({
  specialties: z.array(EmployeeSpecialtyDtoSchema),
  certifications: z.array(z.string()).optional(),
  experience: z.string().optional(),

  hourlyRate: z.number().positive().optional(),
  commissionRate: z.number().optional(),

  defaultSchedule: z.object({
    workdays: z.array(z.number()),
    workHours: z.object({
      start: time24hSchema,
      end: time24hSchema,
    }),
  }),

  stats: z.object({
    rating: z.number(),
    totalBookings: z.number(),
    completedBookings: z.number(),
    cancelledBookings: z.number(),
    noShowRate: z.number(),
    totalRevenue: z.number(),
    averageServiceTime: z.number(),
  }),

  hireDate: z.string(),
  employeeId: mongoObjectIdSchema.optional(),
  department: z.string().optional(),
  isAcceptingBookings: z.boolean(),
  maxDailyBookings: z.number(),
  vacationMode: z.boolean(),
});

export const EmployeeDtoSchema = z.object({
  _id: mongoObjectIdSchema,

  fullName: z.string(),
  email: z.string(),
  phoneNumber: z.string().optional(),
  gender: z.enum(['male', 'female']),
  dateOfBirth: z.string().optional(),
  profilePicture: z.object({
    url: z.string().nullable(),
    publicId: z.string().nullable(),
  }),
  address: z
    .object({
      province: z.string(),
      ward: z.string(),
    })
    .optional(),
  role: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  employeeInfo: EmployeeInfoDtoSchema,

  createdAt: z.string(),
  updatedAt: z.string(),
});

export const EmployeeDashboardStartDtoSchema = z.object({
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

export type EmployeeDashboardStatDto = z.infer<typeof EmployeeDashboardStartDtoSchema>;
export type EmployeeInfoDto = z.infer<typeof EmployeeInfoDtoSchema>;
export type EmployeeDto = z.infer<typeof EmployeeDtoSchema>;
