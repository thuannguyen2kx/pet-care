import { z } from 'zod';

export const ServicesQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['all', 'active', 'inactive']).optional(),
  sort: z.enum(['updated_desc', 'price_asc', 'price_desc']).optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
});

// ================
// Types
// ===============
export type ServicesQuery = z.infer<typeof ServicesQuerySchema>;
