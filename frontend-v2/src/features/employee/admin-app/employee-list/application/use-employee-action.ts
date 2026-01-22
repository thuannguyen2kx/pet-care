import { employeeActions } from '@/features/employee/admin-app/employee-list/application/employee-actions';
import type { EmployeeActionKey } from '@/features/employee/admin-app/employee-list/application/employee-actions.key';
import type { EmployeeListItem } from '@/features/employee/domain/employee.entity';
import type { ActionHandlers } from '@/shared/action-system/types';
import { useAdminActions } from '@/shared/action-system/use-action';

export function useEmployeeActions(
  employee: EmployeeListItem,
  handlers: ActionHandlers<EmployeeListItem, EmployeeActionKey>,
) {
  return useAdminActions(employeeActions, employee, { handlers });
}
