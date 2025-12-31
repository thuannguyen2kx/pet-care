import { z } from 'zod';

export const getEmployeeListFilterSchema = z.object({
  specialty: z.string().optional(),
  isAcceptingBookings: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type TEmployeeFilter = z.infer<typeof getEmployeeListFilterSchema>;
