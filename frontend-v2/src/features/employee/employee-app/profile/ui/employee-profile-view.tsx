import type { UpdateEmployee } from '@/features/employee/domain/employee-state';
import type { Employee } from '@/features/employee/domain/employee.entity';
import { EmployeeSumaryCard } from '@/features/employee/employee-app/profile/ui/employee-sumary-card';
import { EmployeeInfoFormController } from '@/features/employee/employee-app/profile/ui/update-employee/employee-info-form-controller';

type Props = {
  employee: Employee;
};
const mapProfileToUpdateEmployeeForm = (profile: Employee): UpdateEmployee => {
  return {
    employeeId: profile.id,
    fullName: profile.fullName,
    phoneNumber: profile.phoneNumber,
    specialties: profile.employeeInfo?.specialties,
    hourlyRate: profile.employeeInfo?.hourlyRate,
    commissionRate: profile.employeeInfo?.commissionRate,
    department: profile.employeeInfo?.department,
    vacationMode: profile.employeeInfo?.vacationMode,
    isAcceptingBookings: profile.employeeInfo?.isAcceptingBookings,
    maxDailyBookings: profile.employeeInfo?.maxDailyBookings,
  };
};

export function EmployeeProfileView({ employee }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <EmployeeSumaryCard employee={employee} />
      <EmployeeInfoFormController formValues={mapProfileToUpdateEmployeeForm(employee)} />
    </div>
  );
}
