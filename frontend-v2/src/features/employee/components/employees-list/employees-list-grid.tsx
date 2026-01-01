import { useState } from 'react';

import { EmployeeInfoDialogController } from '@/features/employee/components/employee-action/update-employee/employee-info-dialog-controller';
import { EmployeeCardContainer } from '@/features/employee/components/employees-list/employee-card-container';
import type { TEmployeeListItem } from '@/features/employee/types';

type Props = {
  employees: TEmployeeListItem[];
};
export function EmployeesListGrid({ employees }: Props) {
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {employees.map((employee) => (
          <EmployeeCardContainer
            key={employee._id}
            employee={employee}
            onEdit={() => setEditingEmployeeId(employee._id)}
          />
        ))}
      </div>
      <EmployeeInfoDialogController
        employeeId={editingEmployeeId}
        open={!!editingEmployeeId}
        onOpenChange={(open) => {
          if (!open) setEditingEmployeeId(null);
        }}
      />
    </>
  );
}
