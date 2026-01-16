import z from 'zod';

export const TopEmployeeQuerySchema = z.object({
  limit: z.coerce.number().optional(),
  sortBy: z.enum(['rating', 'revenue', 'completed']).optional(),
});

export type TopEmployeeQuery = z.infer<typeof TopEmployeeQuerySchema>;
