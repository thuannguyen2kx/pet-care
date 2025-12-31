import { useState } from 'react';
import { toast } from 'sonner';

import {
  EmployeeActionKey,
  type TEmployeeActionKey,
} from '@/features/employee/actions/employee-actions.key';
import { useChangeEmployeeStatus } from '@/features/employee/api/change-employee-status';
import { useDeleteEmployee } from '@/features/employee/api/delete-employee';
import { EmployeeCardView } from '@/features/employee/components/employees-list/employee-card-view';
import { useEmployeeActions } from '@/features/employee/components/employees-list/use-employee-action';
import type { TEmployeeListItem } from '@/features/employee/types';
import { ActionMenu } from '@/shared/action-system/components/action-menu';
import type { ActionHandlers } from '@/shared/action-system/types';
import { USER_STATUS_UI } from '@/shared/constant';

export function EmployeeCardContainer({ employee }: { employee: TEmployeeListItem }) {
  const statusUI = USER_STATUS_UI[employee.status];
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const deleteEmployee = useDeleteEmployee();
  const changeEmployeeStatus = useChangeEmployeeStatus({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Đã cập nhật trạng thái nhân viên');
      },
    },
  });
  const handlers: ActionHandlers<TEmployeeListItem, TEmployeeActionKey> = {
    dialog: {
      open: (key) => {
        switch (key) {
          case EmployeeActionKey.EDIT:
            setOpenEditDialog(true);
            break;
        }
      },
    },
    mutate: (key, entity) => {
      switch (key) {
        case EmployeeActionKey.DELETE:
          deleteEmployee.mutate(entity._id);
          break;
        case EmployeeActionKey.TOGGLE_STATUS:
          changeEmployeeStatus.mutate({
            employeeId: entity._id,
            status: entity.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
          });
      }
    },
  };

  const { actions, onActionClick } = useEmployeeActions(employee, handlers);

  return (
    <EmployeeCardView
      employee={employee}
      statusUI={statusUI}
      actionMenu={<ActionMenu actions={actions} onActionClick={onActionClick} />}
    />
  );
}
