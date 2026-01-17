import { Award, Crown, Medal, Star, UserCheck, UserX } from 'lucide-react';

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED',
} as const;
export type TUserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
} as const;
export type TGender = (typeof GENDER)[keyof typeof GENDER];

export const MEMBER_SHIP_TIER = {
  BRONZE: 'BRONZE',
  SILVER: 'SILVER',
  GOLD: 'GOLD',
  PLATINUM: 'PLATINUM',
} as const;
export type TMemberShipTier = (typeof MEMBER_SHIP_TIER)[keyof typeof MEMBER_SHIP_TIER];
export type MembershipTier = (typeof MEMBER_SHIP_TIER)[keyof typeof MEMBER_SHIP_TIER];
export type MembershipTierUIConfig = {
  value: MembershipTier;
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
export const MEMBERSHIP_TIER_UI_CONFIG: Record<MembershipTier, MembershipTierUIConfig> = {
  BRONZE: {
    value: 'BRONZE',
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
    value: 'SILVER',
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
    value: 'GOLD',
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
    value: 'PLATINUM',
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
  return MEMBERSHIP_TIER_UI_CONFIG[tier];
};

export const getMembershipTierOptions = () =>
  Object.values(MEMBERSHIP_TIER_UI_CONFIG)
    .sort((a, b) => a.rank - b.rank)
    .map(({ value, label }) => ({
      value,
      label,
    }));

export const USER_STATUS_UI: Record<
  TUserStatus,
  {
    value: TUserStatus;
    label: string;
    className: string;
  }
> = {
  ACTIVE: {
    value: 'ACTIVE',
    label: 'Đang hoạt động',
    className: 'bg-success/10 text-success border-success/30',
  },
  INACTIVE: {
    value: 'INACTIVE',
    label: 'Ngừng hoạt động',
    className: 'bg-muted text-muted-foreground',
  },
  SUSPENDED: {
    value: 'SUSPENDED',
    label: 'Tạm khóa',
    className: 'bg-warning/10 text-warning border-warning/30',
  },
  DELETED: {
    value: 'DELETED',
    label: 'Đã xoá',
    className: 'bg-destructive/10 text-destructive',
  },
};

export const USER_STATUS_ACTIONS: Record<
  TUserStatus,
  {
    toggleActive?: {
      label: string;
      icon: React.ElementType;
      nextStatus: TUserStatus;
      intent: 'activate' | 'deactivate';
    };
  }
> = {
  ACTIVE: {
    toggleActive: {
      label: 'Vô hiệu hóa',
      icon: UserX,
      nextStatus: 'INACTIVE',
      intent: 'deactivate',
    },
  },
  INACTIVE: {
    toggleActive: {
      label: 'Kích hoạt',
      icon: UserCheck,
      nextStatus: 'ACTIVE',
      intent: 'activate',
    },
  },
  SUSPENDED: {},
  DELETED: {},
};
export const GENDER_UI: Record<TGender, string> = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
};
