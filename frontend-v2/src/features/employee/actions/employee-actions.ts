import { Edit, Trash2, UserCheck, UserX } from 'lucide-react';

import type { TEmployeeListItem } from '../types';

import {
  EmployeeActionKey,
  type TEmployeeActionKey,
} from '@/features/employee/actions/employee-actions.key';
import { USER_STATUS } from '@/features/user/domain/user-status';
import type { AdminAction } from '@/shared/action-system/types';

export const employeeActions: AdminAction<TEmployeeListItem, TEmployeeActionKey>[] = [
  {
    id: 'edit',
    label: 'Chỉnh sửa',
    icon: Edit,
    run: ({ entity, handlers }) => {
      handlers.dialog?.open?.(EmployeeActionKey.EDIT, entity);
    },
  },

  {
    id: 'toggle-status',
    label: 'Vô hiệu hoá',
    icon: UserX,
    visible: ({ entity }) => entity.status === USER_STATUS.ACTIVE,
    enabled: ({ entity }) => entity.status === USER_STATUS.ACTIVE,

    confirm: {
      title: 'Xác nhận thay đổi trạng thái',
      description: 'Bạn có chắc chắn muốn thay đổi trạng thái nhân viên này?',
    },

    run: async ({ entity, handlers }) => {
      handlers?.mutate?.(EmployeeActionKey.TOGGLE_STATUS, entity);
    },
  },
  {
    id: 'toggle-status',
    label: 'Kích hoạt',
    icon: UserCheck,
    visible: ({ entity }) => entity.status !== USER_STATUS.ACTIVE,
    enabled: ({ entity }) => entity.status === USER_STATUS.INACTIVE,

    confirm: {
      title: 'Xác nhận thay đổi trạng thái',
      description: 'Bạn có chắc chắn muốn thay đổi trạng thái nhân viên này?',
    },

    run: async ({ entity, handlers }) => {
      handlers?.mutate?.(EmployeeActionKey.TOGGLE_STATUS, entity);
    },
  },
  {
    id: 'delete',
    label: 'Xóa',
    icon: Trash2,
    variant: 'destructive',
    confirm: {
      title: 'Xóa nhân viên',
      description: 'Hành động này không thể hoàn tác',
    },
    run: async ({ entity, handlers }) => {
      handlers?.mutate?.(EmployeeActionKey.DELETE, entity);
    },
  },
];
