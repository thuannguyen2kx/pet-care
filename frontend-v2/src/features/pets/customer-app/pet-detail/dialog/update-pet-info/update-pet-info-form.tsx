import { FormProvider, type UseFormReturn } from 'react-hook-form';

import {
  PetBirthDateField,
  PetBreedField,
  PetGenderField,
  PetMicrochipField,
  PetNameField,
  PetNeuteredField,
  PetStatsField,
  PetTypeField,
} from '@/features/pets/components/form-fields';
import type { UpdatePetInfo } from '@/features/pets/domain/pet.state';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';

type Props = {
  form: UseFormReturn<UpdatePetInfo>;
  onSubmit: () => void;
  onClose: () => void;
  isSubmitting: boolean;
};
export function UpdatePetInfoForm({ form, onSubmit, onClose, isSubmitting }: Props) {
  return (
    <FormProvider {...form}>
      <ScrollArea className="h-[80vh]">
        <form onSubmit={onSubmit} className="space-y-5 p-4">
          <PetNameField />
          <PetTypeField />
          <PetBreedField />
          <PetGenderField />
          <PetBirthDateField />
          <PetStatsField />
          <PetMicrochipField />
          <PetNeuteredField />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>
              Huỷ
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Lưu thông tin
            </Button>
          </div>
        </form>
      </ScrollArea>
    </FormProvider>
  );
}
