import { FormProvider, type UseFormReturn } from 'react-hook-form';

import { PetImageUploadField } from '@/features/pets/components/form-fields';
import type { TUpdatePetImageInput } from '@/features/pets/schemas';
import { Button } from '@/shared/ui/button';

type Props = {
  form: UseFormReturn<TUpdatePetImageInput>;
  isSubmitting: boolean;
  petImage?: string;
  onSubmit: () => void;
};
export function UpdatePetImageForm({ form, petImage, isSubmitting, onSubmit }: Props) {
  return (
    <FormProvider {...form}>
      <form className="mt-6 flex flex-col justify-center space-y-4" onSubmit={onSubmit}>
        <PetImageUploadField initialUrl={petImage} />
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Huỷ
          </Button>

          <Button type="submit" disabled={!form.formState.isValid || isSubmitting}>
            Lưu ảnh
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
