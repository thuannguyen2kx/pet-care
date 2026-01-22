import { Award, Crown, Medal, Star } from 'lucide-react';

import type { MembershipTier } from '@/features/customer/domain/customer-entity';

export type MembershipTierConfig = {
  label: string;
  shortLabel?: string;
  rank: number;
  color: {
    text: string;
    bg: string;
    border?: string;
  };
  icon: React.ComponentType<{ className?: string }>;
};
export const MEMBERSHIP_TIER_CONFIG: Record<MembershipTier, MembershipTierConfig> = {
  BRONZE: {
    label: 'Đồng',
    shortLabel: 'Bronze',
    rank: 1,
    color: {
      text: 'text-amber-700',
      bg: 'bg-amber-100',
      border: 'border-amber-300',
    },
    icon: Medal,
  },

  SILVER: {
    label: 'Bạc',
    shortLabel: 'Silver',
    rank: 2,
    color: {
      text: 'text-slate-600',
      bg: 'bg-slate-100',
      border: 'border-slate-300',
    },
    icon: Award,
  },

  GOLD: {
    label: 'Vàng',
    shortLabel: 'Gold',
    rank: 3,
    color: {
      text: 'text-yellow-700',
      bg: 'bg-yellow-100',
      border: 'border-yellow-300',
    },
    icon: Star,
  },

  PLATINUM: {
    label: 'Bạch kim',
    shortLabel: 'Platinum',
    rank: 4,
    color: {
      text: 'text-indigo-700',
      bg: 'bg-indigo-100',
      border: 'border-indigo-300',
    },
    icon: Crown,
  },
};
export const getMembershipTierConfig = (tier: MembershipTier) => {
  return MEMBERSHIP_TIER_CONFIG[tier];
};
