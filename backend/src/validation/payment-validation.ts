
import { z } from 'zod';

// Payment method validation
export const paymentMethodSchema = z.enum(['card', 'cash', 'bank_transfer']);

// Payment processing validation
export const paymentSchema = z.object({
  paymentMethod: paymentMethodSchema,
  stripeToken: z.string().optional(),
  saveCard: z.boolean().optional().default(false)
});

// Payment ID validation
export const paymentIdSchema = z.string().min(1, 'Payment ID is required');

// Refund validation
export const refundSchema = z.object({
  amount: z.number().positive('Refund amount must be positive'),
  reason: z.string().optional()
});

// Payment filter validation
export const paymentFilterSchema = z.object({
  status: z.enum(['all', 'pending', 'completed', 'failed', 'refunded']).optional(),
  method: z.enum(['all', 'card', 'cash', 'bank_transfer']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});