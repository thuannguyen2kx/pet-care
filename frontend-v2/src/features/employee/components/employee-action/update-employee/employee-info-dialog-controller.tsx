import { useGetEmployee } from '@/features/employee/api/get-employee';
import { EmployeeInfoFormController } from '@/features/employee/components/employee-action/update-employee/employee-info-form-controller';
import { mapProfileToUpdateEmployeeForm } from '@/features/employee/mapper/map-profile-to-update-employee-form';
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
              employeeId={employeeId!}
              formValues={mapProfileToUpdateEmployeeForm(employeeQuery.data!.data.user)}
              onClose={() => onOpenChange(false)}
            />
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
