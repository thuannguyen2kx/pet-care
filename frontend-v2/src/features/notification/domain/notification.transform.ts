import { formatDistanceToNowStrict } from 'date-fns';
import { vi } from 'date-fns/locale';

import type {
  NotificationQueryDto,
  UserNotificationDto,
} from '@/features/notification/domain/notification.dto';
import {
  NotificationDataSchemaMap,
  type Notification,
  type NotificationType,
} from '@/features/notification/domain/notification.entity';
import type { NotificationQuery } from '@/features/notification/domain/notification.state';

export const mapNotificationDtoToEntity = (dto: UserNotificationDto): Notification => {
  const createdAt = new Date(dto.createdAt);
  const readAt = dto.readAt ? new Date(dto.readAt) : null;

  return {
    id: dto._id,

    type: dto.notificationId.type as NotificationType,
    title: dto.notificationId.title,
    message: dto.notificationId.message,
    data: dto.notificationId.data,

    isRead: dto.isRead,
    isUnread: !dto.isRead,

    readAt,
    createdAt,

    timeAgo: formatDistanceToNowStrict(createdAt, { locale: vi }),
  };
};

export const mapNotificationsDtoToEntity = (dtos: UserNotificationDto[]): Notification[] => {
  return dtos.map(mapNotificationDtoToEntity);
};
export function parseNotificationData(notification: Notification) {
  const schema = NotificationDataSchemaMap[notification.type];
  if (!schema) return null;

  const result = schema.safeParse(notification.data);
  return result.success ? result.data : null;
}

// =====================
// State => Dto
// =====================
export const mapNotificationQueryToDto = (state: NotificationQuery): NotificationQueryDto => {
  return {
    limit: state.limit,
    cursor: state.cursor,
  };
};
