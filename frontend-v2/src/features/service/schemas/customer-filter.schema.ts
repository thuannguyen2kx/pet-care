import { z } from 'zod';
export const customerFilterServiceSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  category: z.string().optional(),
});

export type TCustomerServiceFilter = z.infer<typeof customerFilterServiceSchema>;
