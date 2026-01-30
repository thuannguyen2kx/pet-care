import z from 'zod';

import { UserNotificationDto } from '@/features/notification/domain/notification.dto';

export const NotificationsResponseSchema = z.object({
  items: z.array(UserNotificationDto),
  meta: z.object({
    limit: z.number(),
    hasNext: z.boolean(),
    nextCursor: z.string().nullable(),
  }),
});

export const NotificationUnReadCountResponseSchema = z.object({
  count: z.number(),
});
