import z from 'zod';

import { StripeCheckoutDtoSchema } from '@/features/payments/domain/payment.dto';

export const StripeCheckoutResponseSchema = z.object({
  data: StripeCheckoutDtoSchema,
});
