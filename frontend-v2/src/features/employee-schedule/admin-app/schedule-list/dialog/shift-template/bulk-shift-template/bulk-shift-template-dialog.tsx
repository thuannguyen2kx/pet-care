import { BulkCreateShiftTemplateForm } from '@/features/employee-schedule/admin-app/schedule-list/dialog/shift-template/bulk-shift-template/bulk-create-shift-template-form';
import { useBulkCreateShiftTemplateForm } from '@/features/employee-schedule/admin-app/schedule-list/dialog/shift-template/bulk-shift-template/use-bulk-create-shift-template';
import type { BulkCreateShiftsTemplate } from '@/features/employee-schedule/domain/schedule.state';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

type Prop = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  employeeFullName: string;
  onSubmit: (payload: BulkCreateShiftsTemplate) => void;
};

export function BulkShiftTemplateDialog({
  open,
  onOpenChange,
  employeeId,
  employeeFullName,
  onSubmit,
}: Prop) {
  const { form } = useBulkCreateShiftTemplateForm({ employeeId });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo ca làm việc theo tuần</DialogTitle>
          <DialogDescription>
            Cấu hình ca làm việc cố định theo tuần cho {employeeFullName}
          </DialogDescription>
        </DialogHeader>
        <BulkCreateShiftTemplateForm form={form} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Huỷ</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={form.handleSubmit((data) => {
              onSubmit(data);
            })}
          >
            Lưu lịch tuần
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
