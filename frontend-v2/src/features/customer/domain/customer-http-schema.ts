import { z } from 'zod';

import { CustomerUserDtoSchema } from '@/features/customer/domain/customer-dto';
export const GetCurrentCustomerResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    user: CustomerUserDtoSchema,
  }),
});

export type GetCurrentCustomerResponseDto = z.infer<typeof GetCurrentCustomerResponseSchema>;
