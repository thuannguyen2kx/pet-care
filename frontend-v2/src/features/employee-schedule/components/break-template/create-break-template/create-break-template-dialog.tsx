import { CreateBreakTemplateForm } from '@/features/employee-schedule/components/break-template/create-break-template/create-break-template-form';
import { useCreateBreakTemplateForm } from '@/features/employee-schedule/components/break-template/create-break-template/use-create-break-template-form';
import { mapFormToCreateBreakTemplatePayload } from '@/features/employee-schedule/mappers/map-form-to-create-break-template';
import type { TCreateBreakTemplatePayload } from '@/features/employee-schedule/schemas';
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
import { ScrollArea } from '@/shared/ui/scroll-area';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  employeeFullName: string;
  onSubmit: ({
    employeeId,
    payload,
  }: {
    employeeId: string;
    payload: TCreateBreakTemplatePayload;
  }) => void;
};
export function CreateBreakTemplateDialog({
  open,
  onOpenChange,
  employeeId,
  employeeFullName,
  onSubmit,
}: Props) {
  const { form } = useCreateBreakTemplateForm();

  const handleSubmit = form.handleSubmit((data) => {
    const payload = mapFormToCreateBreakTemplatePayload(data);
    onSubmit({ employeeId, payload });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Tạo thời gian nghỉ</DialogTitle>
          <DialogDescription>
            Tạo thời gian nghỉ (nghỉ trưa, nghỉ giải lao..) cho {employeeFullName}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <CreateBreakTemplateForm form={form} />
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Huỷ</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>
            Tạo thời gian nghỉ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
