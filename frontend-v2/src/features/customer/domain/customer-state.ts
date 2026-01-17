import { z } from 'zod';
export const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.date().nullable(),
  address: z
    .object({
      province: z.string(),
      ward: z.string(),
    })
    .optional(),
});

export const CustomersQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  memberShipTier: z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']).optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
});

export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
export type CustomersQuery = z.infer<typeof CustomersQuerySchema>;
