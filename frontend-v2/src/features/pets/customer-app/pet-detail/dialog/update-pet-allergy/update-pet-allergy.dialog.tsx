import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { UpdatePetAllergyForm } from './update-pet-allergy.form';
import { useUpdatePetAllergyForm } from './use-update-pet-allergy';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';

type PetAllergyDialogProps = {
  petId: string;
  allergies: string[];
};
export function UpdatePetAllergyDialog({ petId, allergies }: PetAllergyDialogProps) {
  const [open, setOpen] = useState(false);

  const { form, submit, isSubmitting } = useUpdatePetAllergyForm({
    petId,
    allergies,
    onSuccess: () => {
      toast.success('Đã cập nhật thông tin thú cưng');
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="cursor-pointer gap-1">
          <Plus className="size-4" />
          Thêm
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dị ứng</DialogTitle>
          <DialogDescription>Thú cưng của bạn có dị ứng với gì không?</DialogDescription>
        </DialogHeader>
        <UpdatePetAllergyForm
          form={form}
          isSubmitting={isSubmitting}
          onSubmit={submit}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
