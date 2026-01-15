import z from 'zod';

import { imageDtoSchema } from '@/shared/lib/zod-primitives';

// ============================================
// ENUMS
// ============================================
export const bookingStatusSchema = z.enum([
  'pending',
  'confirmed',
  'in-progress',
  'completed',
  'cancelled',
  'no-show',
]);

export const paymentStatusSchema = z.enum(['pending', 'paid', 'refunded', 'failed']);

export const serviceCategory = z.enum(['GROOMING', 'SPA', 'HEALTHCARE', 'TRAINING']);

export const petTypeSchema = z.enum(['dog', 'cat']);

export const cancellationInitiatorSchema = z.enum(['customer', 'employee', 'admin', 'system']);

// ======================
// Value Objects
// ======================

export const serviceSnapshotSchema = z.object({
  name: z.string(),
  price: z.number().min(0),
  duration: z.number().min(15),
  category: serviceCategory,
});

export const statusHistoryEntrySchema = z.object({
  id: z.string(),
  status: bookingStatusSchema,
  changedAt: z.string(),
  changedBy: z.string(),
  reason: z.string().optional(),
});

// ======================
// nested entities
// ======================
export const customerInfoSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.email(),
  profilePicture: imageDtoSchema,
});

export const petInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: petTypeSchema,
  breed: z.string(),
  image: z.url().optional(),
});

export const employeeInfoSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  profilePicture: imageDtoSchema,
  specialties: z.array(serviceCategory),
});

export const serviceInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().min(0),
  duration: z.number().min(15),
  category: serviceCategory,
});

// ======================
// Main Entity
// ======================
export const bookingEntitySchema = z.object({
  id: z.string(),

  customer: customerInfoSchema,
  pet: petInfoSchema,
  employee: employeeInfoSchema,
  service: serviceInfoSchema,

  scheduledDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  duration: z.number().min(15),

  serviceSnapshot: serviceSnapshotSchema,

  status: bookingStatusSchema,
  statusHistory: z.array(statusHistoryEntrySchema),

  paymentStatus: paymentStatusSchema,
  totalAmount: z.number().min(0),
  paidAmount: z.number().min(0),
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

  rating: z
    .object({
      score: z.number().min(1).max(5),
      feedback: z.string().optional(),
      ratedAt: z.string(),
    })
    .optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paginationSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const bookingDetailSchema = z.object({
  id: z.string(),
  customer: customerInfoSchema,
  pet: petInfoSchema,
  employee: employeeInfoSchema,
  service: serviceInfoSchema,

  scheduledDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  duration: z.number().min(15),

  serviceSnapshot: serviceSnapshotSchema,

  status: bookingStatusSchema,
  statusHistory: z.array(statusHistoryEntrySchema),

  paymentStatus: paymentStatusSchema,
  totalAmount: z.number().min(0),
  paidAmount: z.number().min(0),
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
  cancellationInitiator: cancellationInitiatorSchema.optional(),
  completedAt: z.string().optional(),
  completedBy: z.string().optional(),

  rating: z
    .object({
      score: z.number().min(1).max(5),
      feedback: z.string().optional(),
      ratedAt: z.string(),
    })
    .optional(),
  isPast: z.boolean(),
  isCancellable: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const bookingStatisticSchema = z.object({
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
// ============================================
// TYPES
// ============================================

export type Booking = z.infer<typeof bookingEntitySchema>;
export type BookingStatus = z.infer<typeof bookingStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type ServiceCategory = z.infer<typeof serviceCategory>;
export type PetType = z.infer<typeof petTypeSchema>;
export type CancellationInitiator = z.infer<typeof cancellationInitiatorSchema>;

export type CustomerInfo = z.infer<typeof customerInfoSchema>;
export type PetInfo = z.infer<typeof petInfoSchema>;
export type EmployeeInfo = z.infer<typeof employeeInfoSchema>;
export type ServiceInfo = z.infer<typeof serviceInfoSchema>;

export type ServiceSnapshot = z.infer<typeof serviceSnapshotSchema>;
export type StatusHistoryEntry = z.infer<typeof statusHistoryEntrySchema>;
export type ProfilePicture = z.infer<typeof imageDtoSchema>;

export type Pagination = z.infer<typeof paginationSchema>;
export type BookingDetail = z.infer<typeof bookingDetailSchema>;
export type BookingStatistic = z.infer<typeof bookingStatisticSchema>;
// ============================================
// CONSTANTS
// ============================================

export const BOOKING_STATUSES = bookingStatusSchema.options;
export const PAYMENT_STATUSES = paymentStatusSchema.options;
export const SERVICE_CATEGORIES = serviceCategory.options;
export const PET_TYPES = petTypeSchema.options;
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in-progress',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no-show',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
  FAILED: 'failed',
} as const;
