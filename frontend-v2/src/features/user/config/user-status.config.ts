import type { UserStatus } from '@/features/user/domain/user.entity';

type UserStatusConfig = {
  label: string;
  className: string;
};
export const USER_STATUS_UI: Record<UserStatus, UserStatusConfig> = {
  ACTIVE: {
    label: 'Đang hoạt động',
    className: 'bg-success/10 text-success border-success/30',
  },
  INACTIVE: {
    label: 'Ngừng hoạt động',
    className: 'bg-muted text-muted-foreground',
  },
  SUSPENDED: {
    label: 'Tạm khóa',
    className: 'bg-warning/10 text-warning border-warning/30',
  },
  DELETED: {
    label: 'Đã xoá',
    className: 'bg-destructive/10 text-destructive',
  },
};

export const getUserStatusConfig = (status: UserStatus) => USER_STATUS_UI[status];
export const formatUserStatus = (status: UserStatus) => USER_STATUS_UI[status].label;
