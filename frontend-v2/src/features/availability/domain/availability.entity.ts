import z from 'zod';

import { mongoObjectIdSchema, time24hSchema } from '@/shared/lib/zod-primitives';

// ========================
// Business Enitty
// ========================

export const availableSlot = z.object({
  startTime: time24hSchema,
  endTime: time24hSchema,
  available: z.boolean(),
});

export const bookableEmployeeSchema = z.object({
  employeeId: mongoObjectIdSchema,
  fullName: z.string(),
  avatar: z.string().optional(),
  specialties: z.array(z.string()),
  rating: z.number(),
  completedServices: z.number(),
});

// =======================
// Types
// =======================
export type AvailableSlot = z.infer<typeof availableSlot>;
export type BookableEmployee = z.infer<typeof bookableEmployeeSchema>;
