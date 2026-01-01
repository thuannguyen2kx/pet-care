import { EmployeeInfoFormController } from '@/features/employee/components/employee-action/update-employee/employee-info-form-controller';
import { EmployeeSumaryCard } from '@/features/employee/components/employee-info/employee-sumary-card';
import type { TUpdateEmployeeInput } from '@/features/employee/shemas';
import type { TProfile } from '@/features/user/types';

type Props = {
  employee: TProfile;
  updateEmployeeFormValues: TUpdateEmployeeInput;
};
export function EmployeeProfilePrecenter({ employee, updateEmployeeFormValues }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <EmployeeSumaryCard employee={employee} />
      <EmployeeInfoFormController employeeId={employee._id} formValues={updateEmployeeFormValues} />
    </div>
  );
}
