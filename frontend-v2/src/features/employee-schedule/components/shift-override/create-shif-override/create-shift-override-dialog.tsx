import { CreateShiftOverrideForm } from '@/features/employee-schedule/components/shift-override/create-shif-override/create-shift-override-form';
import { useCreateShiftOverrideForm } from '@/features/employee-schedule/components/shift-override/create-shif-override/use-create-shift-override-form';
import { BulkCreateShiftTemplateForm } from '@/features/employee-schedule/components/shift-template/bulk-shift-template/bulk-create-shift-template-form';
import { mapFormToCreateShiftOverridePayload } from '@/features/employee-schedule/mappers/map-form-to-create-shift-override';
import { mapWeeklyFormToBulkPayload } from '@/features/employee-schedule/mappers/map-weekly-form-to-bulk-payload';
import type {
  BulkCreateShiftsPayload,
  CreateShiftOverridePayload,
} from '@/features/employee-schedule/schemas';
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
  onSubmit: ({
    employeeId,
    payload,
  }: {
    employeeId: string;
    payload: CreateShiftOverridePayload;
  }) => void;
};

export function CreateShiftOverrideDialog({
  open,
  onOpenChange,
  employeeId,
  employeeFullName,
  onSubmit,
}: Prop) {
  const { form } = useCreateShiftOverrideForm();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Điều chỉnh ca làm việc</DialogTitle>
          <DialogDescription>
            Tạo ngoại lệ cho ngày cụ thể (nghỉ phép, tăng ca...) {employeeFullName}
          </DialogDescription>
        </DialogHeader>
        <CreateShiftOverrideForm form={form} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Huỷ</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={form.handleSubmit((data) => {
              console.log(data);
              const payload = mapFormToCreateShiftOverridePayload(data);
              onSubmit({ employeeId, payload });
            })}
          >
            Lưu điều chỉnh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
