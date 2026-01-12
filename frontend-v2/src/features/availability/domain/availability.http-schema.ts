import z from 'zod';

import {
  availableSlotDtoSchema,
  bookableEmployeeDtoSchema,
} from '@/features/availability/domain/availability.dto';
import { isoDateSchema, mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

// ======================
// HTTP Response Schema
// ======================

export const availableSlotsHttpResponseSchema = z.object({
  data: z.object({
    date: isoDateSchema,
    employeeId: mongoObjectIdSchema,
    serviceId: mongoObjectIdSchema,
    totalSlots: z.number(),
    availableSlots: z.number(),
    slots: z.array(availableSlotDtoSchema),
  }),
});

export const bookableEmployeesHttpResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    employees: z.array(bookableEmployeeDtoSchema),
  }),
});

// ========================
// Types
// ========================

export type TAvailableSlotsHttpResponse = z.infer<typeof availableSlotsHttpResponseSchema>;
export type TBookableEmployeesHttpResponse = z.infer<typeof bookableEmployeesHttpResponseSchema>;
