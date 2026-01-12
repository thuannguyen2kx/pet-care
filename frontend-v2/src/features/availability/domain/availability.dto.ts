import z from 'zod';

import { isoDateSchema, mongoObjectIdSchema, time24hSchema } from '@/shared/lib/zod-primitives';

// ===================
// DTOs (Raw data from API)
export const availableSlotDtoSchema = z.object({
  startTime: time24hSchema,
  endTime: time24hSchema,
  available: z.boolean(),
});

export const bookableEmployeeDtoSchema = z.object({
  _id: mongoObjectIdSchema,
  fullName: z.string(),
  avatar: z.string().nullable(),
  specialties: z.array(z.string()),
  rating: z.number(),
  completedServices: z.number(),
});

export const availableSlotsQueryDtoSchema = z.object({
  serviceId: mongoObjectIdSchema,
  employeeId: mongoObjectIdSchema,
  date: isoDateSchema,
});

// =====================
// Types
// =====================

export type AvailableSlotDto = z.infer<typeof availableSlotDtoSchema>;
export type BookableEmployeeDto = z.infer<typeof bookableEmployeeDtoSchema>;
export type AvailableSlotsQueryDto = z.infer<typeof availableSlotsQueryDtoSchema>;
