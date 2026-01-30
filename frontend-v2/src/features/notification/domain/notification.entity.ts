import z from 'zod';

export const NotificationTypeSchema = z.enum([
  'APPOINTMENT_CREATED',
  'APPOINTMENT_CONFIRMED',
  'APPOINTMENT_CANCELLED',
  'APPOINTMENT_RESCHEDULED',
  'APPOINTMENT_REMINDER',

  'PET_VACCINE_DUE',
  'PET_VACCINE_OVERDUE',
  'PET_CHECKUP_REMINDER',
  'PET_HEALTH_RECORD_UPDATED',

  'PAYMENT_SUCCESS',
  'PAYMENT_FAILED',
  'REFUND_PROCESSED',

  'NEW_BOOKING_ASSIGNED',
  'STAFF_SCHEDULE_UPDATED',

  'SYSTEM_ANNOUNCEMENT',
  'SYSTEM_MAINTENANCE',
  'POLICY_UPDATED',
]);
export const NotificationSchema = z.object({
  id: z.string(),
  type: NotificationTypeSchema,
  title: z.string(),
  message: z.string(),
  data: z.unknown(),

  isRead: z.boolean(),
  readAt: z.date().nullable(),

  createdAt: z.date(),

  isUnread: z.boolean(),
  timeAgo: z.string(),
});

const BookingCreatedDataSchema = z.object({
  bookingId: z.string(),
});
const BookingConfirmedDataSchema = z.object({
  bookingId: z.string(),
});

const BookingCancelledDataSchema = z.object({
  bookingId: z.string(),
  initiator: z.string(),
  reason: z.string(),
});
const BookingRescheduledDataSchema = z.object({
  bookingId: z.string(),
  newTime: z.string(),
});
const BookingReminderDataSchema = z.object({
  bookingId: z.string(),
  newTime: z.string(),
});
const NewBookingAssignedDataSchema = z.object({
  bookingId: z.string(),
});

export type Notification = z.infer<typeof NotificationSchema>;
export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const NOTIFICATION_TYPES = {
  APPOINTMENT_CREATED: 'APPOINTMENT_CREATED',
  APPOINTMENT_CONFIRMED: 'APPOINTMENT_CONFIRMED',
  APPOINTMENT_CANCELLED: 'APPOINTMENT_CANCELLED',
  APPOINTMENT_RESCHEDULED: 'APPOINTMENT_RESCHEDULED',
  APPOINTMENT_REMINDER: 'APPOINTMENT_REMINDER',

  PET_VACCINE_DUE: 'PET_VACCINE_DUE',
  PET_VACCINE_OVERDUE: 'PET_VACCINE_OVERDUE',
  PET_CHECKUP_REMINDER: 'PET_CHECKUP_REMINDER',
  PET_HEALTH_RECORD_UPDATED: 'PET_HEALTH_RECORD_UPDATED',

  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  REFUND_PROCESSED: 'REFUND_PROCESSED',

  NEW_BOOKING_ASSIGNED: 'NEW_BOOKING_ASSIGNED',
  STAFF_SCHEDULE_UPDATED: 'STAFF_SCHEDULE_UPDATED',

  SYSTEM_ANNOUNCEMENT: 'SYSTEM_ANNOUNCEMENT',
  SYSTEM_MAINTENANCE: 'SYSTEM_MAINTENANCE',
  POLICY_UPDATED: 'POLICY_UPDATED',
} as const;

export const NotificationDataSchemaMap = {
  [NOTIFICATION_TYPES.APPOINTMENT_CREATED]: BookingCreatedDataSchema,
  [NOTIFICATION_TYPES.APPOINTMENT_CONFIRMED]: BookingConfirmedDataSchema,
  [NOTIFICATION_TYPES.APPOINTMENT_CANCELLED]: BookingCancelledDataSchema,
  [NOTIFICATION_TYPES.APPOINTMENT_RESCHEDULED]: BookingRescheduledDataSchema,
  [NOTIFICATION_TYPES.APPOINTMENT_REMINDER]: BookingReminderDataSchema,

  [NOTIFICATION_TYPES.PET_VACCINE_DUE]: null,
  [NOTIFICATION_TYPES.PET_VACCINE_OVERDUE]: null,
  [NOTIFICATION_TYPES.PET_CHECKUP_REMINDER]: null,
  [NOTIFICATION_TYPES.PET_HEALTH_RECORD_UPDATED]: null,

  [NOTIFICATION_TYPES.PAYMENT_SUCCESS]: null,
  [NOTIFICATION_TYPES.PAYMENT_FAILED]: null,
  [NOTIFICATION_TYPES.REFUND_PROCESSED]: null,

  [NOTIFICATION_TYPES.NEW_BOOKING_ASSIGNED]: NewBookingAssignedDataSchema,
  [NOTIFICATION_TYPES.STAFF_SCHEDULE_UPDATED]: null,

  [NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT]: null,
  [NOTIFICATION_TYPES.SYSTEM_MAINTENANCE]: null,
  [NOTIFICATION_TYPES.POLICY_UPDATED]: null,
} as const;
