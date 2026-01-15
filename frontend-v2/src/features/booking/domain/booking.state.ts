import z from 'zod';

import { BOOKING_STATUS, bookingStatusSchema } from '@/features/booking/domain/booking.entity';
import { isoDateSchema, mongoObjectIdSchema, time24hSchema } from '@/shared/lib/zod-primitives';

// ==========================
// UI STATE (Drafts, Inputs, Filters, Queries, Constants)
// ==========================
export const createBookingDraftSchema = z.object({
  serviceId: mongoObjectIdSchema,
  petId: mongoObjectIdSchema.nullable(),
  employeeId: mongoObjectIdSchema.nullable(),
  scheduledDate: isoDateSchema.nullable(),
  startTime: time24hSchema.nullable(),
  customerNotes: z.string().max(1000).default(''),
});
export const createBookingSchema = z.object({
  serviceId: mongoObjectIdSchema,
  petId: mongoObjectIdSchema,
  employeeId: mongoObjectIdSchema,
  scheduledDate: isoDateSchema,
  startTime: time24hSchema,
  customerNotes: z.string().max(1000).optional(),
});

export const stepPetSchema = createBookingDraftSchema
  .pick({ serviceId: true, petId: true })
  .refine((data) => data.petId !== null, {
    message: 'Vui lòng chọn thú cưng',
    path: ['petId'],
  });

export const stepEmployeeSchema = createBookingDraftSchema
  .pick({ serviceId: true, petId: true, employeeId: true })
  .refine((data) => data.employeeId !== null, {
    message: 'Vui lòng chọn chuyên viên',
    path: ['employeeId'],
  });

export const stepDateTimeSchema = createBookingDraftSchema
  .pick({ serviceId: true, petId: true, employeeId: true, scheduledDate: true, startTime: true })
  .refine((data) => data.scheduledDate !== null && data.startTime !== null, {
    message: 'Vui lòng chọn ngày',
  });

export const BOOKING_STEP = {
  SELECT_PET: 'select-pet',
  SELECT_EMPLOYEE: 'select-employee',
  SELECT_DATETIME: 'select-datetime',
  CONFIRM: 'confirm',
} as const;

export type BookingStep = (typeof BOOKING_STEP)[keyof typeof BOOKING_STEP];

export const BOOKING_STEPS: BookingStep[] = [
  BOOKING_STEP.SELECT_PET,
  BOOKING_STEP.SELECT_EMPLOYEE,
  BOOKING_STEP.SELECT_DATETIME,
  BOOKING_STEP.CONFIRM,
];

export const customerBookingQuerySchema = z.object({
  status: bookingStatusSchema.optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  view: z.enum(['today', 'upcoming', 'ongoing', 'past', 'all']).optional(),
});

export const adminBookingQuerySchema = z.object({
  status: bookingStatusSchema.optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  view: z.enum(['today', 'upcoming', 'ongoing', 'past', 'all']).optional(),
  employeeId: mongoObjectIdSchema.optional(),
  customerId: mongoObjectIdSchema.optional(),
  startDate: isoDateSchema.optional(),
});

export const cancelBookingSchema = z.object({
  bookingId: mongoObjectIdSchema,
  reason: z.string().min(1, 'Cần nêu lý do huỷ lịch').max(500),
});

export const bookingStatisticQueryDto = z.object({
  employeeId: mongoObjectIdSchema.optional(),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
});

export const updateBookingStatusSchema = z.object({
  bookingId: mongoObjectIdSchema,
  status: z.enum([
    BOOKING_STATUS.CONFIRMED,
    BOOKING_STATUS.IN_PROGRESS,
    BOOKING_STATUS.COMPLETED,
    BOOKING_STATUS.NO_SHOW,
  ]),
  reason: z.string().max(500).optional(),
  employeeNotes: z.string().max(1000).optional(),
});

export const BOOKING_VIEW = {
  TODAY: 'today',
  UPCOMMING: 'upcoming',
  ONGOING: 'ongoing',
  PAST: 'past',
  ALL: 'all',
} as const;

// ========================
// Types
// ========================

export type CreateBookingDraft = z.infer<typeof createBookingDraftSchema>;
export type CreateBooking = z.infer<typeof createBookingSchema>;
export type CustomerBookingQuery = z.infer<typeof customerBookingQuerySchema>;
export type AdminBookingQuery = z.infer<typeof adminBookingQuerySchema>;
export type CancelBooking = z.infer<typeof cancelBookingSchema>;
export type BookingStatisticQuery = z.infer<typeof bookingStatisticQueryDto>;
export type UpdateBookingStatus = z.infer<typeof updateBookingStatusSchema>;
// ====================
// DERIVED TYPES
// ====================
export type CompleteCreateBookingDraft = {
  serviceId: string;
  petId: string;
  employeeId: string;
  scheduledDate: string;
  startTime: string;
  customerNotes: string;
};
