import { useState } from 'react';

import { EmployeeInfoDialogController } from '@/features/employee/admin-app/employee-list/dialog/update-employee/employee-info-dialog-controller';
import { EmployeeCardContainer } from '@/features/employee/admin-app/employee-list/ui/employee-card-container';
import type { EmployeeListItem } from '@/features/employee/domain/employee.entity';

type Props = {
  employees: EmployeeListItem[];
};
export function EmployeesListGrid({ employees }: Props) {
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {employees.map((employee) => (
          <EmployeeCardContainer
            key={employee.id}
            employee={employee}
            onEdit={() => setEditingEmployeeId(employee.id)}
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
