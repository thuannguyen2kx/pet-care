import z from 'zod';

export const PaymentMethodSchema = z.enum(['cash', 'card']);

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const PAYMENT_METHOD = {
  CASH: 'cash',
  CARD: 'card',
} as const;
