import { Edit } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { UpdatePetInfoForm } from '@/features/pets/components/pet-actions/update-pet-info/update-pet-info.form';
import { useUpdatePetInfoForm } from '@/features/pets/components/pet-actions/update-pet-info/use-update-pet-info';
import type { TPet } from '@/features/pets/types';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

export function UpdatePetInfoDialog({ pet }: { pet: TPet }) {
  const [open, setOpen] = useState(false);
  const { form, submit, isSubmitting } = useUpdatePetInfoForm({
    petId: pet._id,
    pet,
    onSucess: () => {
      toast.success('Cập nhật thông tin thú cưng thành công');
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="bg-transparent">
          <Edit className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border">
        <DialogHeader>
          <DialogTitle>Thông tin thú cưng</DialogTitle>
          <DialogDescription>Cập nhật thông tin mới nhất về thú cưng của bạn</DialogDescription>
        </DialogHeader>
        <UpdatePetInfoForm
          form={form}
          onSubmit={submit}
          isSubmitting={isSubmitting}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
