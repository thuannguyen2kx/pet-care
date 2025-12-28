import { Upload } from 'lucide-react';
import { useState } from 'react';

import { UpdatePetImageForm } from './update-pet-image.form';
import { useUpdatePetImageForm } from './use-update-pet-image';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
type UpdatePetImageDialogProps = {
  petId: string;
  petImage?: string;
};

export const UpdatePetImageDialog = ({ petId, petImage }: UpdatePetImageDialogProps) => {
  const [open, setOpen] = useState(false);

  const { form, submit, isSubmitting } = useUpdatePetImageForm({
    petId,
    onSuccess: () => {
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Upload className="size-4" />
          Cập nhật ảnh
        </Button>
      </DialogTrigger>

      <DialogContent className="border-border">
        <DialogHeader className="space-y-1 text-center">
          <DialogTitle className="text-lg font-semibold">Ảnh đại diện thú cưng</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Tải lên ảnh mới để hồ sơ trông dễ thương hơn 🐾
          </DialogDescription>
        </DialogHeader>
        <UpdatePetImageForm
          form={form}
          petImage={petImage}
          onSubmit={submit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
