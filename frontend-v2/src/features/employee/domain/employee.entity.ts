import z from 'zod';

import { mongoObjectIdSchema, time24hSchema } from '@/shared/lib/zod-primitives';

export const EmployeeSpecialtySchema = z.enum([
  'GROOMING',
  'SPA',
  'HEALTHCARE',
  'TRAINING',
  'BOARDING',
]);

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

export const EmployeeInfoSchema = z.object({
  specialties: z.array(EmployeeSpecialtySchema),
  certifications: z.array(z.string()).optional(),
  experience: z.string().optional(),

  hourlyRate: z.number().positive().optional(),
  commissionRate: z.number().optional(),

  defaultSchedule: z.object({
    workDays: z.array(z.number()),
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

export const EmployeeSchema = z.object({
  id: mongoObjectIdSchema,

  fullName: z.string(),
  email: z.string(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),

  profilePicture: z.url().nullable(),
  address: z
    .object({
      province: z.string(),
      ward: z.string(),
    })
    .optional(),
  role: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  employeeInfo: EmployeeInfoSchema,

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const EmployeeListItemSchema = z.object({
  id: mongoObjectIdSchema,
  fullName: z.string(),
  email: z.string(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  profilePicture: z.url().nullable(),
  address: z
    .object({
      province: z.string(),
      ward: z.string(),
    })
    .optional(),
  role: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),

  employeeInfo: z.object({
    specialties: z.array(EmployeeSpecialtySchema),
    hourlyRate: z.number().positive().optional(),
    commissionRate: z.number().optional(),
    stats: z.object({
      rating: z.number(),
      totalBookings: z.number(),
      completedBookings: z.number(),
    }),
    isAcceptingBookings: z.boolean(),
    vacationMode: z.boolean(),
    maxDailyBookings: z.number(),
  }),
  createdAt: z.date(),
});

// =======================
// Types
// =======================
export type EmployeeDashboardStart = z.infer<typeof EmployeeDashboardStartSchema>;
export type EmployeeSpecialty = z.infer<typeof EmployeeSpecialtySchema>;
export type EmployeeInfo = z.infer<typeof EmployeeInfoSchema>;
export type Employee = z.infer<typeof EmployeeSchema>;
export type EmployeeListItem = z.infer<typeof EmployeeListItemSchema>;
// =======================
// Constants
// =======================
export const EMPLOYEE_SPECIALTIES = {
  GROOMING: 'GROOMING',
  SPA: 'SPA',
  HEALTHCARE: 'HEALTHCARE',
  TRAINING: 'TRAINING',
  BOARDING: 'BOARDING',
} as const;
