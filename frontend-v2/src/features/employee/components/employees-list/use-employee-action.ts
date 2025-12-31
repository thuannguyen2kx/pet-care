import { employeeActions } from '@/features/employee/actions/employee-actions';
import type { TEmployeeActionKey } from '@/features/employee/actions/employee-actions.key';
import type { TEmployeeListItem } from '@/features/employee/types';
import type { ActionHandlers } from '@/shared/action-system/types';
import { useAdminActions } from '@/shared/action-system/use-action';

export function useEmployeeActions(
  employee: TEmployeeListItem,
  handlers: ActionHandlers<TEmployeeListItem, TEmployeeActionKey>,
) {
  return useAdminActions(employeeActions, employee, { handlers });
}
