import z from 'zod';

import { PaymentMethodSchema } from '@/features/payments/domain/payment.entity';

export const ProcessPaymentSchema = z.object({
  bookingId: z.string(),
  paymentMethod: PaymentMethodSchema,
});

export type ProcessPayment = z.infer<typeof ProcessPaymentSchema>;
