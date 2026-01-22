import {
  EmployeesListContent,
  type EmployeesListState,
} from '@/features/employee/admin-app/employee-list/ui/employees-list-content';
import { EmployeesListPagination } from '@/features/employee/admin-app/employee-list/ui/employees-list-paginaton';
import { EmployeesListToolbar } from '@/features/employee/admin-app/employee-list/ui/employees-list-toolbar';
import type { EmployeesQuery } from '@/features/employee/domain/employee-state';
import type { EmployeeListItem } from '@/features/employee/domain/employee.entity';

type Props = {
  employees: EmployeeListItem[];
  isLoading: boolean;
  totalPages: number;
  filter: EmployeesQuery;
  setFilters: (next: Partial<EmployeesQuery>) => void;
};
export function AdminEmployeesListView({
  employees,
  isLoading,
  totalPages,
  filter,
  setFilters,
}: Props) {
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
      <EmployeesListToolbar filter={filter} setFilters={setFilters} />
      <EmployeesListContent state={listState} />
      <EmployeesListPagination
        totalPages={totalPages}
        page={filter.page}
        onPageChange={(page) => {
          setFilters({ page });
        }}
      />
    </>
  );
}
