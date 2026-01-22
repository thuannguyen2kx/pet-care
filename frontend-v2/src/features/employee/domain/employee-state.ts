import z from 'zod';

import { EmployeeSpecialtySchema } from '@/features/employee/domain/employee.entity';
import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

export const EmployeesQuerySchema = z.object({
  specialty: EmployeeSpecialtySchema.optional(),
  acceptBooking: z.enum(['all', 'accepting', 'not-accepting']).optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
});

export const CreateEmployeeSchema = z.object({
  fullName: z.string().min(2, 'Yêu cầu họ tên phải có ít nhất 2 ký tự'),
  email: z.email('Email không hợp lệ'),
  phoneNumber: z.string().min(1, 'Yêu cầu số điện thoại'),
  specialties: z.array(z.string()).min(1, 'Yêu cầu ít nhất 1 chuyên môn'),
  hourlyRate: z.coerce.number().positive().optional(),
  department: z.string().optional(),
});

export const UpdateEmployeeSchema = z.object({
  employeeId: mongoObjectIdSchema,
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

export type EmployeesQuery = z.infer<typeof EmployeesQuerySchema>;
export type UpdateEmployee = z.infer<typeof UpdateEmployeeSchema>;
export type CreateEmployee = z.infer<typeof CreateEmployeeSchema>;
