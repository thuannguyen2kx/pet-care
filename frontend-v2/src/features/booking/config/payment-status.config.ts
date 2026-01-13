import { Clock, CheckCircle, RotateCcw, XCircle, type LucideIcon } from 'lucide-react';

import type { PaymentStatus } from '@/features/booking/domain/booking.entity';

export interface PaymentStatusConfig {
  label: string;
  className: string;
  icon: LucideIcon;
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, PaymentStatusConfig> = {
  pending: {
    label: 'Chờ thanh toán',
    className: 'bg-yellow-50 text-yellow-600',
    icon: Clock,
  },
  paid: {
    label: 'Đã thanh toán',
    className: 'bg-green-50 text-green-600',
    icon: CheckCircle,
  },
  refunded: {
    label: 'Đã hoàn tiền',
    className: 'bg-blue-50 text-blue-600',
    icon: RotateCcw,
  },
  failed: {
    label: 'Thanh toán thất bại',
    className: 'bg-red-50 text-red-600',
    icon: XCircle,
  },
} as const;

export function getPaymentStatusConfig(status: PaymentStatus): PaymentStatusConfig {
  return PAYMENT_STATUS_CONFIG[status];
}
