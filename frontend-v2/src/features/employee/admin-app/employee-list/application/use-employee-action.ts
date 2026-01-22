import { employeeActions } from '@/features/employee/admin-app/employee-list/application/employee-actions';
import type { TEmployeeActionKey } from '@/features/employee/admin-app/employee-list/application/employee-actions.key';
import type { TEmployeeListItem } from '@/features/employee/types';
import type { ActionHandlers } from '@/shared/action-system/types';
import { useAdminActions } from '@/shared/action-system/use-action';

export function useEmployeeActions(
  employee: TEmployeeListItem,
  handlers: ActionHandlers<TEmployeeListItem, TEmployeeActionKey>,
) {
  return useAdminActions(employeeActions, employee, { handlers });
}
