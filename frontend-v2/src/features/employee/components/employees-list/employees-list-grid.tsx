import { EmployeeCardContainer } from '@/features/employee/components/employees-list/employee-card-container';
import type { TEmployeeListItem } from '@/features/employee/types';

type Props = {
  employees: TEmployeeListItem[];
};
export function EmployeesListGrid({ employees }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {employees.map((employee) => (
        <EmployeeCardContainer key={employee._id} employee={employee} />
      ))}
    </div>
  );
}
