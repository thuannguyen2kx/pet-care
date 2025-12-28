import { FormProvider, type UseFormReturn } from 'react-hook-form';

import { FormActions } from './update-pet-info.action';

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
import type { TUpdatePetInfoInput } from '@/features/pets/schemas';
import { ScrollArea } from '@/shared/ui/scroll-area';

type Props = {
  form: UseFormReturn<TUpdatePetInfoInput>;
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

          <FormActions isSubmitting={isSubmitting} onClose={onClose} />
        </form>
      </ScrollArea>
    </FormProvider>
  );
}
