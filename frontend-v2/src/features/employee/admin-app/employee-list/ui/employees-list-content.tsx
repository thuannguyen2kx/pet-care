import { Search } from 'lucide-react';

import { EmployeesListGrid } from './employees-list-grid';

import type { EmployeeListItem } from '@/features/employee/domain/employee.entity';
import { EmptyState } from '@/shared/components/template/empty-state';
import { SectionSpinner } from '@/shared/components/template/loading';

export type EmployeesListState =
  | { type: 'loading' }
  | { type: 'empty' }
  | { type: 'data'; employees: EmployeeListItem[] };

type Props = {
  state: EmployeesListState;
};

export function EmployeesListContent({ state }: Props) {
  switch (state.type) {
    case 'loading':
      return <SectionSpinner />;
    case 'empty':
      return (
        <EmptyState
          icon={Search}
          title="Không tìm thấy nhân viên"
          description="Thử thay đổi từ khoá hoặc bộ lọc tìm kiếm"
        />
      );
    case 'data':
      return <EmployeesListGrid employees={state.employees} />;
  }
}
