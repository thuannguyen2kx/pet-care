import { z } from 'zod';

import { SPECIALTIES } from '@/features/service/constants';
export const adminServiceQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),

  category: z.enum(SPECIALTIES).optional(),

  isActive: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === 'true' ? true : false)),

  sortBy: z.enum(['name', 'price', 'createdAt', 'updatedAt']).default('updatedAt'),

  sortOrder: z.enum(['asc', 'desc']).default('desc'),

  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(20),
});
