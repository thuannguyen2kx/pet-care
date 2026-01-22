import { toast } from 'sonner';

import {
  EMPLOYEE_ACTION_KEYS,
  type EmployeeActionKey,
} from '@/features/employee/admin-app/employee-list/application/employee-actions.key';
import { useEmployeeActions } from '@/features/employee/admin-app/employee-list/application/use-employee-action';
import { EmployeeCardView } from '@/features/employee/admin-app/employee-list/ui/employee-card-view';
import { useChangeEmployeeStatus } from '@/features/employee/api/change-employee-status';
import { useDeleteEmployee } from '@/features/employee/api/delete-employee';
import type { EmployeeListItem } from '@/features/employee/domain/employee.entity';
import { USER_STATUS_UI } from '@/features/user/domain/user-status';
import { ActionMenu } from '@/shared/action-system/components/action-menu';
import type { ActionHandlers } from '@/shared/action-system/types';

export function EmployeeCardContainer({
  employee,
  onEdit,
}: {
  employee: EmployeeListItem;
  onEdit: (id: string) => void;
}) {
  const statusUI = USER_STATUS_UI[employee.status];
  const deleteEmployee = useDeleteEmployee();
  const changeEmployeeStatus = useChangeEmployeeStatus({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Đã cập nhật trạng thái nhân viên');
      },
    },
  });
  const handlers: ActionHandlers<EmployeeListItem, EmployeeActionKey> = {
    dialog: {
      open: (key, entity) => {
        switch (key) {
          case EMPLOYEE_ACTION_KEYS.EDIT:
            onEdit(entity.id);
            break;
        }
      },
    },
    mutate: (key, entity) => {
      switch (key) {
        case EMPLOYEE_ACTION_KEYS.DELETE:
          deleteEmployee.mutate(entity.id);
          break;
        case EMPLOYEE_ACTION_KEYS.TOGGLE_STATUS:
          changeEmployeeStatus.mutate({
            employeeId: entity.id,
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
