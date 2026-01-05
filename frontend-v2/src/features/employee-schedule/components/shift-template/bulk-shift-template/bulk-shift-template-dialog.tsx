import { BulkCreateShiftTemplateForm } from '@/features/employee-schedule/components/shift-template/bulk-shift-template/bulk-create-shift-template-form';
import { useBulkCreateShiftTemplateForm } from '@/features/employee-schedule/components/shift-template/bulk-shift-template/use-bulk-create-shift-template';
import { mapWeeklyFormToBulkPayload } from '@/features/employee-schedule/mappers/map-weekly-form-to-bulk-payload';
import type { BulkCreateShiftsPayload } from '@/features/employee-schedule/schemas';
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
  onSubmit: (payload: BulkCreateShiftsPayload) => void;
};

export function BulkShiftTemplateDialog({
  open,
  onOpenChange,
  employeeId,
  employeeFullName,
  onSubmit,
}: Prop) {
  const { form } = useBulkCreateShiftTemplateForm();

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
              const payload = mapWeeklyFormToBulkPayload(employeeId, data);
              onSubmit(payload);
            })}
          >
            Lưu lịch tuần
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
