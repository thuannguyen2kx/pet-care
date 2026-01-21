import { CreateShiftOverrideForm } from '@/features/employee-schedule/admin-app/schedule-list/dialog/create-shif-override/create-shift-override-form';
import { useCreateShiftOverrideForm } from '@/features/employee-schedule/admin-app/schedule-list/dialog/create-shif-override/use-create-shift-override-form';
import type { CreateShiftOverride } from '@/features/employee-schedule/domain/schedule.state';
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
  onSubmit: (payload: CreateShiftOverride) => void;
};

export function CreateShiftOverrideDialog({
  open,
  onOpenChange,
  employeeId,
  employeeFullName,
  onSubmit,
}: Prop) {
  const { form } = useCreateShiftOverrideForm({ employeeId });

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
              onSubmit(data);
            })}
          >
            Lưu điều chỉnh
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
