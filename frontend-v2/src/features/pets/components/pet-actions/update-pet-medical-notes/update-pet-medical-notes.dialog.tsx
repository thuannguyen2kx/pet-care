import { Edit } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { UpdatePetMedicalNotesForm } from '@/features/pets/components/pet-actions/update-pet-medical-notes/update-pet-medical-notes.form';
import { useUpdatePetMedicalNotesForm } from '@/features/pets/components/pet-actions/update-pet-medical-notes/use-update-pet-medical-notes';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
export function UpdatePetMedicalNotesDialog({
  petId,
  medicalNotes,
}: {
  petId: string;
  medicalNotes?: string;
}) {
  const [open, setOpen] = useState(false);
  const { form, submit, isSubmitting } = useUpdatePetMedicalNotesForm({
    petId,
    medicalNotes,
    onSuccess: () => {
      setOpen(false);
      toast.success('Đã cập nhật ghi chú');
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="cursor-pointer gap-1">
          <Edit className="size-4" />
          Cập nhật
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ghi chú sức khoẻ</DialogTitle>
          <DialogDescription>Thú cưng của bạn có cần chú ý gì về sức khoẻ không?</DialogDescription>
        </DialogHeader>
        <UpdatePetMedicalNotesForm
          form={form}
          isSubmitting={isSubmitting}
          onSubmit={submit}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
