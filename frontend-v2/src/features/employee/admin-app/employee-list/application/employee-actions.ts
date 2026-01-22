import { Edit, Trash2, UserCheck, UserX } from 'lucide-react';

import {
  EMPLOYEE_ACTION_KEYS,
  type EmployeeActionKey,
} from '@/features/employee/admin-app/employee-list/application/employee-actions.key';
import type { EmployeeListItem } from '@/features/employee/domain/employee.entity';
import { USER_STATUS } from '@/features/user/domain/user.entity';
import type { AdminAction } from '@/shared/action-system/types';

export const employeeActions: AdminAction<EmployeeListItem, EmployeeActionKey>[] = [
  {
    id: 'edit',
    label: 'Chỉnh sửa',
    icon: Edit,
    run: ({ entity, handlers }) => {
      handlers.dialog?.open?.(EMPLOYEE_ACTION_KEYS.EDIT, entity);
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
      handlers?.mutate?.(EMPLOYEE_ACTION_KEYS.TOGGLE_STATUS, entity);
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
      handlers?.mutate?.(EMPLOYEE_ACTION_KEYS.TOGGLE_STATUS, entity);
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
      handlers?.mutate?.(EMPLOYEE_ACTION_KEYS.DELETE, entity);
    },
  },
];
