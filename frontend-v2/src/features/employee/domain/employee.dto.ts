import z from 'zod';

import { mongoObjectIdSchema, time24hSchema } from '@/shared/lib/zod-primitives';

export const EmployeeSpecialtyDtoSchema = z.enum([
  'GROOMING',
  'SPA',
  'HEALTHCARE',
  'TRAINING',
  'BOARDING',
]);

export const EmployeesQueryDtoSchema = z.object({
  specialty: EmployeeSpecialtyDtoSchema.optional(),
  isAcceptingBookings: z.boolean().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export const CreateEmployeeDtoSchema = z.object({
  fullName: z.string(),
  email: z.email('Email không hợp lệ'),
  phoneNumber: z.string().min(1, 'Yêu cầu số điện thoại'),
  specialties: z.array(z.string()).min(1, 'Yêu cầu ít nhất 1 chuyên môn'),
  hourlyRate: z.coerce.number().positive().optional(),
  department: z.string().optional(),
});

export const UpdateEmployeeDtoSchema = z.object({
  fullName: z.string().min(2).optional(),
  phoneNumber: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  hourlyRate: z.number().positive().optional(),
  commissionRate: z.number().min(0).max(100).optional(),
  department: z.string().optional(),
  isAcceptingBookings: z.boolean().optional(),
  maxDailyBookings: z.number().positive().optional(),
  vacationMode: z.boolean().optional(),
});
// ================
// Response Dto
// ================
export const EmployeeInfoDtoSchema = z.object({
  specialties: z.array(EmployeeSpecialtyDtoSchema),
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

export const EmployeeDtoSchema = z.object({
  _id: mongoObjectIdSchema,

  fullName: z.string(),
  email: z.string(),
  phoneNumber: z.string().optional(),
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

export const EmployeeListItemDtoSchema = z.object({
  _id: mongoObjectIdSchema,
  fullName: z.string(),
  email: z.string(),
  phoneNumber: z.string().optional(),
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

  employeeInfo: z.object({
    specialties: z.array(EmployeeSpecialtyDtoSchema),
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
  createdAt: z.string(),
});

export type EmployeeDashboardStatDto = z.infer<typeof EmployeeDashboardStartDtoSchema>;
export type EmployeeInfoDto = z.infer<typeof EmployeeInfoDtoSchema>;
export type EmployeeDto = z.infer<typeof EmployeeDtoSchema>;
export type EmployeesQueryDto = z.infer<typeof EmployeesQueryDtoSchema>;
export type EmployeeListItemDto = z.infer<typeof EmployeeListItemDtoSchema>;
export type CreateEmployeeDto = z.infer<typeof CreateEmployeeDtoSchema>;
export type UpdateEmployeeDto = z.infer<typeof UpdateEmployeeDtoSchema>;
