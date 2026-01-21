import { CreateShiftTemplateForm } from '@/features/employee-schedule/admin-app/schedule-list/dialog/shift-template/create-shift-template/create-shift-template-form';
import { useCreateShiftTemplateForm } from '@/features/employee-schedule/admin-app/schedule-list/dialog/shift-template/create-shift-template/use-create-shift-template-form';
import type { CreateShiftTemplate } from '@/features/employee-schedule/domain/schedule.state';
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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  onSubmit: (payload: CreateShiftTemplate) => void;
};
export function CreatShiftTemplateDialog({ open, onOpenChange, employeeId, onSubmit }: Props) {
  const form = useCreateShiftTemplateForm({ employeeId });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo ca làm việc</DialogTitle>
          <DialogDescription>Tạo ca làm việc cho nhân viên</DialogDescription>
        </DialogHeader>
        <CreateShiftTemplateForm form={form} />
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
            Tạo ca
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
