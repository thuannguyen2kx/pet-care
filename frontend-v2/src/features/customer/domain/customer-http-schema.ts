import { z } from 'zod';

import { CustomerUserDtoSchema } from '@/features/customer/domain/customer-dto';
export const GetCurrentCustomerResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    user: CustomerUserDtoSchema,
  }),
});

export const GetCustomerListResponseSchema = z.object({
  data: z.object({
    customers: z.array(CustomerUserDtoSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
  }),
});
export type GetCurrentCustomerResponseDto = z.infer<typeof GetCurrentCustomerResponseSchema>;
