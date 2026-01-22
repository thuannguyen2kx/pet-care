import { EmployeeInfoFormController } from '@/features/employee/admin-app/employee-list/dialog/update-employee/employee-info-form-controller';
import { useGetEmployee } from '@/features/employee/api/get-employee';
import type { UpdateEmployee } from '@/features/employee/domain/employee-state';
import type { Employee } from '@/features/employee/domain/employee.entity';
import { SectionSpinner } from '@/shared/components/template/loading';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { ScrollArea } from '@/shared/ui/scroll-area';

type Props = {
  employeeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
export function EmployeeInfoDialogController({ employeeId, open, onOpenChange }: Props) {
  const employeeQuery = useGetEmployee({
    employeeId: employeeId!,
    queryConfig: {
      enabled: open && !!employeeId,
    },
  });
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin nhân viên</DialogTitle>
          <DialogDescription>Quản lý và cập nhật thông tin nhân viên của bạn</DialogDescription>
        </DialogHeader>
        {employeeQuery.isLoading && <SectionSpinner />}
        {!employeeQuery.isLoading && (
          <ScrollArea className="max-h-[70vh] pr-4">
            <EmployeeInfoFormController
              isAdmin
              formValues={mapProfileToUpdateEmployeeForm(employeeQuery.data!)}
              onClose={() => onOpenChange(false)}
            />
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
