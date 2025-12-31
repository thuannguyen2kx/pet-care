import {
  EmployeesListContent,
  type EmployeesListState,
} from '@/features/employee/components/employees-list/employees-list-content';
import { EmployeesListPagination } from '@/features/employee/components/employees-list/employees-list-paginaton';
import { EmployeesListToolbar } from '@/features/employee/components/employees-list/employees-list-toolbar';
import type { TEmployeeFilter } from '@/features/employee/shemas';
import type { TEmployeeListItem } from '@/features/employee/types';

type Props = {
  employees: TEmployeeListItem[];
  isLoading: boolean;
  totalPages: number;
  filter: TEmployeeFilter;
};
export function AdminEmployeesListPrecenter({ employees, isLoading, totalPages, filter }: Props) {
  const listState: EmployeesListState = (() => {
    if (isLoading) {
      return { type: 'loading' };
    }

    if (employees.length === 0) {
      return { type: 'empty' };
    }

    return {
      type: 'data',
      employees,
    };
  })();
  return (
    <>
      <EmployeesListToolbar filter={filter} />
      <EmployeesListContent state={listState} />
      <EmployeesListPagination filter={filter} totalPages={totalPages} />
    </>
  );
}
