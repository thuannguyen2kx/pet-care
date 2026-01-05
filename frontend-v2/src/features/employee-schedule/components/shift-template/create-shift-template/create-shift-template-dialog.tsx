import { CreateShiftTemplateForm } from '@/features/employee-schedule/components/shift-template/create-shift-template/create-shift-template-form';
import { useCreateShiftTemplateForm } from '@/features/employee-schedule/components/shift-template/create-shift-template/use-create-shift-template-form';
import { mapFormToCreateShiftTemplate } from '@/features/employee-schedule/mappers/map-form-to-create-shift-template';
import type { CreateShiftTemplatePayload } from '@/features/employee-schedule/schemas';
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
  onSubmit: ({
    employeeId,
    payload,
  }: {
    employeeId: string;
    payload: CreateShiftTemplatePayload;
  }) => void;
};
export function CreatShiftTemplateDialog({ open, onOpenChange, employeeId, onSubmit }: Props) {
  const form = useCreateShiftTemplateForm();
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
              const payload = mapFormToCreateShiftTemplate(data);
              onSubmit({ employeeId, payload });
            })}
          >
            Tạo ca
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
