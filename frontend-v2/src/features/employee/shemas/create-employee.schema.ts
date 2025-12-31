import { z } from 'zod';

export const createEmployeeInputSchema = z.object({
  fullName: z.string().min(2, 'Yêu cầu họ tên phải có ít nhất 2 ký tự'),
  email: z.email('Email không hợp lệ'),
  phoneNumber: z.string().min(1, 'Yêu cầu số điện thoại'),
  specialties: z.array(z.string()).min(1, 'Yêu cầu ít nhất 1 chuyên môn'),
  hourlyRate: z.coerce.number().positive().optional(),
  department: z.string().optional(),
});

export type TCreateEmployeeInput = z.input<typeof createEmployeeInputSchema>;
