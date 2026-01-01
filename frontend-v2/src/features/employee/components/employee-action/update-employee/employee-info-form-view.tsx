import {
  EmployeeAcceptBookingField,
  EmployeeCommissionRateField,
  EmployeeEmailField,
  EmployeeHourlyRateField,
  EmployeeMaxDailyBookingsField,
  EmployeeNameField,
  EmployeePhoneFiled,
  EmployeeSpecialtiesField,
  EmployeeVacationMode,
} from '@/features/employee/components/form-fields';
import { Separator } from '@/shared/ui/separator';

type Props = {
  isEditing?: boolean;
  isAdmin?: boolean;
};
export function EmployeeInfoFormView({ isEditing, isAdmin }: Props) {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <EmployeeNameField disabled={!isEditing} />
        <EmployeeEmailField disabled />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <EmployeePhoneFiled disabled={!isEditing} />
        <EmployeeHourlyRateField disabled={!isAdmin} />
      </div>
      <Separator />
      <EmployeeSpecialtiesField disabled={!isEditing} />
      <Separator />
      <EmployeeAcceptBookingField disabled={!isEditing} />
      {isAdmin && (
        <>
          <EmployeeVacationMode />
          <Separator />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <EmployeeCommissionRateField />
            <EmployeeMaxDailyBookingsField />
          </div>
        </>
      )}
    </form>
  );
}
