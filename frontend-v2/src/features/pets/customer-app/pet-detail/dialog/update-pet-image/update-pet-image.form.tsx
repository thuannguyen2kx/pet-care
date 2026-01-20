import { FormProvider, type UseFormReturn } from 'react-hook-form';

import { PetImageUploadField } from '@/features/pets/components/form-fields';
import type { UpdatePetImage } from '@/features/pets/domain/pet.state';

type Props = {
  form: UseFormReturn<UpdatePetImage>;
  petImage?: string;
};
export function UpdatePetImageForm({ form, petImage }: Props) {
  return (
    <FormProvider {...form}>
      <form className="mt-6 flex flex-col justify-center space-y-4">
        <PetImageUploadField initialUrl={petImage} />
      </form>
    </FormProvider>
  );
}
