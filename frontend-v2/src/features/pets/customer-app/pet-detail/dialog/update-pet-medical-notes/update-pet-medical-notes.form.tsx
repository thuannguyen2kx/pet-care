import { FormProvider, type UseFormReturn } from 'react-hook-form';

import { PetMedicalNotesField } from '@/features/pets/components/form-fields/pet-medical-notes.field';
import type { UpdatePetMedicalNotes } from '@/features/pets/domain/pet.state';
import { Button } from '@/shared/ui/button';

type Props = {
  form: UseFormReturn<UpdatePetMedicalNotes>;
  onSubmit: () => void;
  onClose: () => void;
  isSubmitting: boolean;
};
export function UpdatePetMedicalNotesForm({ form, onSubmit, isSubmitting, onClose }: Props) {
  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <PetMedicalNotesField />
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>
            Huỷ
          </Button>
          <Button className="cursor-pointer" type="submit" disabled={isSubmitting}>
            Cập nhật
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
