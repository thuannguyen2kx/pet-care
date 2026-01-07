import { DialogTitle } from '@radix-ui/react-dialog';

import { UpdateServiceForm } from '@/features/service/components/update-service/update-service-form';
import { useUpdateServiceForm } from '@/features/service/components/update-service/use-update-service-form';
import type { TService } from '@/features/service/domain/service.entity';
import { mapUpdateServiceFormToApiPayload } from '@/features/service/mappers/map-update-service-form-to-api-payload';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/shared/ui/dialog';
import { ScrollArea } from '@/shared/ui/scroll-area';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void;
  initialValue: TService;
  isSubmitting: boolean;
};
export function UpdateServiceDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  initialValue,
}: Props) {
  const { form } = useUpdateServiceForm(initialValue);

  const handleSubmit = form.handleSubmit((data) => {
    console.log('submit', data);
    const payload = mapUpdateServiceFormToApiPayload(data);
    onSubmit(payload);
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật dịch vụ</DialogTitle>
          <DialogDescription>Cập nhật thông tin dịch vụ của cửa hàng</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <UpdateServiceForm form={form} />
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Huỷ
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
