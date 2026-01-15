import z from 'zod';

import { BOOKING_STATUS } from '@/features/booking/domain/booking.entity';
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

export const bookingsQueryDtoSchema = z.object({
  customerId: z.string().optional(),
  employeeId: z.string().optional(),
  petId: z.string().optional(),
  status: z.union([z.string(), z.array(z.string())]).optional(),
  view: z.enum(['today', 'upcoming', 'ongoing', 'past', 'all']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});
export const canncelBooingDtoSchema = z.object({
  reason: z.string().min(1, 'Cancellation reason is required').max(500),
});
export const bookingStatisticQueryDtoSchema = z.object({
  employeeId: mongoObjectIdSchema.optional(),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional(),
});

export const bookingTodayStatisticQueryDtoSchema = z.object({
  employeeId: mongoObjectIdSchema.optional(),
});

export const updateBookingStatusDtoSchema = z.object({
  status: z.enum([
    BOOKING_STATUS.CONFIRMED,
    BOOKING_STATUS.IN_PROGRESS,
    BOOKING_STATUS.COMPLETED,
    BOOKING_STATUS.NO_SHOW,
  ]),
  reason: z.string().max(500).optional(),
  employeeNotes: z.string().max(1000).optional(),
});
export const bookingScheduleQueryDto = z.object({
  date: isoDateSchema.optional(),
  employeeId: mongoObjectIdSchema?.optional(),
});
// =====================
// Response DTOs (Output)
// =====================
const profilePictureDtoSchema = z.object({
  url: z.string().nullable(),
  publicId: z.string().nullable(),
});

const customerDtoSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  email: z.string(),
  profilePicture: profilePictureDtoSchema,
});
const petDtoSchema = z.object({
  _id: z.string(),
  name: z.string(),
  type: z.string(),
  breed: z.string(),
  image: z.object({
    url: z.string().nullable(),
  }),
});

const employeeDtoSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  profilePicture: profilePictureDtoSchema,
  employeeInfo: z.object({
    specialties: z.array(z.string()),
  }),
});

const serviceDtoSchema = z.object({
  _id: z.string(),
  name: z.string(),
  price: z.number(),
  duration: z.number(),
  category: z.string(),
});

const serviceSnapshotDtoSchema = z.object({
  name: z.string(),
  price: z.number(),
  duration: z.number(),
  category: z.string(),
});
const statusHistoryEntryDtoSchema = z.object({
  _id: z.string(),
  status: z.string(),
  changedAt: z.string(),
  changedBy: z.string(),
  reason: z.string().optional(),
});

const ratingDtoSchema = z.object({
  score: z.number(),
  feedback: z.string().optional(),
  ratedAt: z.string(),
});
export const bookingDtoSchema = z.object({
  _id: z.string(),

  customerId: customerDtoSchema,
  petId: petDtoSchema,
  employeeId: employeeDtoSchema,
  serviceId: serviceDtoSchema,

  scheduledDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  duration: z.number(),

  serviceSnapshot: serviceSnapshotDtoSchema,

  status: z.string(),
  statusHistory: z.array(statusHistoryEntryDtoSchema),

  paymentStatus: z.string(),
  totalAmount: z.number(),
  paidAmount: z.number(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),

  customerNotes: z.string().optional(),
  employeeNotes: z.string().optional(),
  internalNotes: z.string().optional(),

  reminderSent: z.boolean(),
  reminderSentAt: z.string().optional(),

  cancelledAt: z.string().optional(),
  cancelledBy: z.string().optional(),
  cancellationReason: z.string().optional(),

  completedAt: z.string().optional(),
  completedBy: z.string().optional(),

  rating: ratingDtoSchema.optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
});

export const paginationDtoSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const bookingDetailDtoSchema = z.object({
  _id: z.string(),

  customerId: customerDtoSchema,
  petId: petDtoSchema,
  employeeId: employeeDtoSchema,
  serviceId: serviceDtoSchema,

  scheduledDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  duration: z.number(),

  serviceSnapshot: serviceSnapshotDtoSchema,

  status: z.string(),
  statusHistory: z.array(statusHistoryEntryDtoSchema),

  paymentStatus: z.string(),
  totalAmount: z.number(),
  paidAmount: z.number(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),

  customerNotes: z.string().optional(),
  employeeNotes: z.string().optional(),
  internalNotes: z.string().optional(),

  reminderSent: z.boolean(),
  reminderSentAt: z.string().optional(),

  cancelledAt: z.string().optional(),
  cancelledBy: z.string().optional(),
  cancellationReason: z.string().optional(),
  cancellationInitiator: z.enum(['customer', 'employee', 'admin', 'system']).optional(),

  completedAt: z.string().optional(),
  completedBy: z.string().optional(),

  rating: ratingDtoSchema.optional(),

  isPast: z.boolean(),
  isCancellable: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
});

export const bookingStatisticDtoSchema = z.object({
  totalBookings: z.number().int().nonnegative(),

  byStatus: z.object({
    pending: z.number().int().nonnegative(),
    confirmed: z.number().int().nonnegative(),
    'in-progress': z.number().int().nonnegative(),
    completed: z.number().int().nonnegative(),
    cancelled: z.number().int().nonnegative(),
    'no-show': z.number().int().nonnegative(),
  }),

  totalRevenue: z.number().nonnegative(),
  averageRating: z.number().min(0).max(5),
});

export const bookingTodayStatisticDtoSchema = z.object({
  date: z.string(),
  totalBookings: z.number().int().nonnegative(),

  byStatus: z.object({
    pending: z.number().int().nonnegative(),
    confirmed: z.number().int().nonnegative(),
    'in-progress': z.number().int().nonnegative(),
    completed: z.number().int().nonnegative(),
    cancelled: z.number().int().nonnegative(),
    'no-show': z.number().int().nonnegative(),
  }),

  totalRevenue: z.number().nonnegative(),
  averageRating: z.number().min(0).max(5),
});
export const bookingScheduleDayDtoSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  date: z.string(),
  bookings: z.array(bookingDtoSchema),
});
// =====================
// Types
// =====================
export type CreateBookingDto = z.infer<typeof createBookingDtoSchema>;
export type BookingDto = z.infer<typeof bookingDtoSchema>;
export type PaginationDto = z.infer<typeof paginationDtoSchema>;
export type BookingQueryDto = z.infer<typeof bookingsQueryDtoSchema>;
export type CancelBookingDto = z.infer<typeof canncelBooingDtoSchema>;
export type BookingDetailDto = z.infer<typeof bookingDetailDtoSchema>;
export type BookingStatisticQueryDto = z.infer<typeof bookingStatisticQueryDtoSchema>;
export type BookingTodayStatisticQueryDto = z.infer<typeof bookingTodayStatisticQueryDtoSchema>;
export type BookingStatisticDto = z.infer<typeof bookingStatisticDtoSchema>;
export type BookingTodayStatisticDto = z.infer<typeof bookingTodayStatisticDtoSchema>;
export type UpdateBookingStatusDto = z.infer<typeof updateBookingStatusDtoSchema>;
export type BookingScheduleQueryDto = z.infer<typeof bookingScheduleQueryDto>;
export type BookingScheduleDayDto = z.infer<typeof bookingScheduleDayDtoSchema>;
