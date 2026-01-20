import { CreateServiceForm } from '@/features/service/admin-app/service-list/dialog/create-service/create-service-form';
import { useCreateServiceForm } from '@/features/service/admin-app/service-list/dialog/create-service/use-create-service-form';
import { buildCreateServiceFormData } from '@/features/service/domain/service.transform';
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
  isSubmitting: boolean;
  onSubmit: (formData: FormData) => void;
};
export function CreateServiceDialog({ open, onOpenChange, isSubmitting, onSubmit }: Props) {
  const { form } = useCreateServiceForm();

  const handleSubmit = form.handleSubmit((data) => {
    const payload = buildCreateServiceFormData(data);
    onSubmit(payload);
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Thêm dịch vụ mới</DialogTitle>
          <DialogDescription>
            Tạo dịch vụ mới cho cửa hàng. Điền đầy đủ thông tin bên dưới.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <CreateServiceForm form={form} />
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Huỷ
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            Tạo dịch vụ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
