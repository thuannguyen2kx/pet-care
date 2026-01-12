import { Clock, CheckCircle, PlayCircle, XCircle, UserX, type LucideIcon } from 'lucide-react';

import type { BookingStatus } from '@/features/booking/domain/booking.entity';

// ============================================
// STATUS CONFIG (UI metadata)
// ============================================

export interface StatusConfig {
  label: string;
  className: string;
  icon: LucideIcon;
  description?: string;
}

export const BOOKING_STATUS_CONFIG: Record<BookingStatus, StatusConfig> = {
  pending: {
    label: 'Chờ xác nhận',
    className: 'bg-yellow-50 text-yellow-600',
    icon: Clock,
    description: 'Đang chờ xác nhận từ nhân viên',
  },
  confirmed: {
    label: 'Đã xác nhận',
    className: 'bg-blue-50 text-blue-600',
    icon: CheckCircle,
    description: 'Đã xác nhận, chờ đến ngày hẹn',
  },
  'in-progress': {
    label: 'Đang thực hiện',
    className: 'bg-purple-50 text-purple-600',
    icon: PlayCircle,
    description: 'Dịch vụ đang được thực hiện',
  },
  completed: {
    label: 'Hoàn thành',
    className: 'bg-green-50 text-green-600',
    icon: CheckCircle,
    description: 'Dịch vụ đã hoàn thành',
  },
  cancelled: {
    label: 'Đã hủy',
    className: 'bg-red-50 text-red-600',
    icon: XCircle,
    description: 'Đặt lịch đã bị hủy',
  },
  'no-show': {
    label: 'Không đến',
    className: 'bg-gray-50 text-gray-600',
    icon: UserX,
    description: 'Khách hàng không đến',
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getStatusConfig(status: BookingStatus): StatusConfig {
  return BOOKING_STATUS_CONFIG[status];
}

export function getStatusLabel(status: BookingStatus): string {
  return BOOKING_STATUS_CONFIG[status].label;
}

export function getStatusIcon(status: BookingStatus): LucideIcon {
  return BOOKING_STATUS_CONFIG[status].icon;
}
