import { Briefcase, Cpu, Shield, User } from 'lucide-react';
import type { ElementType } from 'react';

import type { CancellationInitiator } from '@/features/booking/domain/booking.entity';

export const CANCELLATION_INITIATOR_CONFIG: Record<
  CancellationInitiator,
  {
    label: string;
    description?: string;
    badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
    colorClass: string;
    icon: ElementType;
  }
> = {
  customer: {
    label: 'Khách hàng',
    description: 'Lịch được huỷ bởi khách hàng',
    badgeVariant: 'outline',
    colorClass: 'text-emerald-700 bg-emerald-50',
    icon: User,
  },

  employee: {
    label: 'Nhân viên',
    description: 'Nhân viên huỷ lịch đặt',
    badgeVariant: 'secondary',
    colorClass: 'text-blue-700 bg-blue-50',
    icon: Briefcase,
  },

  admin: {
    label: 'Quản trị viên',
    description: 'Quản trị viên huỷ lịch',
    badgeVariant: 'destructive',
    colorClass: 'text-red-700 bg-red-50',
    icon: Shield,
  },

  system: {
    label: 'Hệ thống',
    description: 'Hệ thống tự động huỷ lịch',
    badgeVariant: 'default',
    colorClass: 'text-stone-700 bg-stone-100',
    icon: Cpu,
  },
};
export const getCancellationInitiatorConfig = (initiator?: CancellationInitiator) => {
  if (!initiator) return null;
  return CANCELLATION_INITIATOR_CONFIG[initiator];
};
