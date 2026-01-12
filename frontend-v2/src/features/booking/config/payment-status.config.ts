import { Clock, CheckCircle, RotateCcw, XCircle, type LucideIcon } from 'lucide-react';

import type { PaymentStatus } from '@/features/booking/domain/booking.entity';

export interface PaymentStatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: LucideIcon;
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, PaymentStatusConfig> = {
  pending: {
    label: 'Chờ thanh toán',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    icon: Clock,
  },
  paid: {
    label: 'Đã thanh toán',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: CheckCircle,
  },
  refunded: {
    label: 'Đã hoàn tiền',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: RotateCcw,
  },
  failed: {
    label: 'Thanh toán thất bại',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    icon: XCircle,
  },
} as const;

export function getPaymentStatusConfig(status: PaymentStatus): PaymentStatusConfig {
  return PAYMENT_STATUS_CONFIG[status];
}
