import z from 'zod';

import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

export const CreateStripeCheckoutDtoSchema = z.object({
  bookingId: mongoObjectIdSchema,
});

export const ProcessPaymentDtoSchema = z.object({
  paymentMethod: z.enum(['card', 'cash']),
});

// ====================
// Response Dto
// ====================
export const StripeCheckoutDtoSchema = z.object({
  sessionId: z.string(),
  url: z.string(),
});

export type CreateStripeCheckoutDto = z.infer<typeof CreateStripeCheckoutDtoSchema>;
export type ProcessPaymentDto = z.infer<typeof ProcessPaymentDtoSchema>;
