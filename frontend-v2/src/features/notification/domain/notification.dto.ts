import z from 'zod';

// =====================
// Requests Dto
// =====================
export const NotificationQueryDto = z.object({
  limit: z.coerce.number().optional(),
  cursor: z.string().optional(),
});

export const NotificationDtoSchema = z.object({
  _id: z.string(),
  type: z.string(),
  title: z.string(),
  message: z.string(),

  data: z.record(z.string(), z.any()).optional(),

  priority: z.number().min(0).max(10),
  createdAt: z.string(),
});

export const UserNotificationDto = z.object({
  _id: z.string(),
  userId: z.string(),
  notificationId: NotificationDtoSchema,
  isRead: z.boolean(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
});

export type NotificationQueryDto = z.infer<typeof NotificationQueryDto>;
export type NotificationDto = z.infer<typeof NotificationDtoSchema>;
export type UserNotificationDto = z.infer<typeof UserNotificationDto>;
