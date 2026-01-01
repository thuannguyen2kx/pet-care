import { z } from 'zod';

export const updateEmployeeInputSchema = z.object({
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

export type TUpdateEmployeeInput = z.input<typeof updateEmployeeInputSchema>;
