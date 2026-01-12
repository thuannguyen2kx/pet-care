import z from 'zod';

import { isoDateSchema, mongoObjectIdSchema, time24hSchema } from '@/shared/lib/zod-primitives';

// ====================
// Request DTOs (Input)
// ====================
export const createBookingDtoSchema = z.object({
  serviceId: mongoObjectIdSchema,
  petId: mongoObjectIdSchema,
  employeeId: mongoObjectIdSchema,
  scheduledDate: isoDateSchema,
  startTime: time24hSchema,
  customerNotes: z.string().max(1000).optional(),
});

// =====================
// Response DTOs (Output)
// =====================

// =====================
// Types
// =====================
export type CreateBookingDto = z.infer<typeof createBookingDtoSchema>;
