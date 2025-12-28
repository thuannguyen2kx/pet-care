import { FormProvider, type UseFormReturn } from 'react-hook-form';

import { PetAllergyField } from '@/features/pets/components/form-fields';
import type { TUpdatePetAllergiesInput } from '@/features/pets/schemas';
import { Button } from '@/shared/ui/button';

type Props = {
  form: UseFormReturn<TUpdatePetAllergiesInput>;
  onSubmit: () => void;
  onClose: () => void;
  isSubmitting: boolean;
};
export function UpdatePetAllergyForm({ form, isSubmitting, onSubmit, onClose }: Props) {
  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <PetAllergyField />
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>
            Huỷ
          </Button>
          <Button type="submit">Cập nhật</Button>
        </div>
      </form>
    </FormProvider>
  );
}
