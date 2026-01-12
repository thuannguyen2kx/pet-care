import z from 'zod';

import { isoDateSchema, mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

// ============================
// UI State (drafts, inputs, queries, filters, constant)
// ============================

export const availableSlotsQuerySchema = z.object({
  serviceId: mongoObjectIdSchema,
  employeeId: mongoObjectIdSchema,
  date: isoDateSchema,
});

// ============================
// Types
// ============================
export type AvailableSlotsQuery = z.infer<typeof availableSlotsQuerySchema>;
