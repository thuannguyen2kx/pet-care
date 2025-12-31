import { UserCheck, UserX } from 'lucide-react';

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
