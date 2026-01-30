import {
  AlertCircle,
  Bell,
  Calendar,
  Check,
  Clock,
  CreditCard,
  Heart,
  Settings,
  Syringe,
  Users,
} from 'lucide-react';
import type { ElementType } from 'react';

import type { NotificationType } from '@/features/notification/domain/notification.entity';

type NotificationTypeConfig = {
  icon: ElementType;
  color: string;
};
export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, NotificationTypeConfig> = {
  APPOINTMENT_CREATED: { icon: Calendar, color: 'text-primary' },
  APPOINTMENT_CONFIRMED: { icon: Check, color: 'text-success' },
  APPOINTMENT_CANCELLED: { icon: AlertCircle, color: 'text-destructive' },
  APPOINTMENT_RESCHEDULED: { icon: Clock, color: 'text-warnning' },
  APPOINTMENT_REMINDER: { icon: Bell, color: 'text-primary' },
  PET_VACCINE_DUE: { icon: Syringe, color: 'text-purple-500' },
  PET_VACCINE_OVERDUE: { icon: Syringe, color: 'text-destructive' },
  PET_CHECKUP_REMINDER: { icon: Heart, color: 'text-pink-500' },
  PET_HEALTH_RECORD_UPDATED: { icon: Heart, color: 'text-primary' },
  PAYMENT_SUCCESS: { icon: CreditCard, color: 'text-success' },
  PAYMENT_FAILED: { icon: CreditCard, color: 'text-destructive' },
  REFUND_PROCESSED: { icon: CreditCard, color: 'text-primary' },
  NEW_BOOKING_ASSIGNED: { icon: Users, color: 'text-primary' },
  STAFF_SCHEDULE_UPDATED: { icon: Calendar, color: 'text-warning' },
  SYSTEM_ANNOUNCEMENT: { icon: Bell, color: 'text-primary' },
  SYSTEM_MAINTENANCE: { icon: Settings, color: 'text-foreground' },
  POLICY_UPDATED: { icon: Settings, color: 'text-primary' },
};

export const getNotificationTypeConfig = (type: NotificationType) => NOTIFICATION_TYPE_CONFIG[type];
