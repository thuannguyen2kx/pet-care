import { FormProvider, type UseFormReturn } from 'react-hook-form';

import { PetCreateBasicInfoStep } from '@/features/pets/components/pet-actions/create-pet/pet-create-basic-info-step';
import { PetCreateDetailStep } from '@/features/pets/components/pet-actions/create-pet/pet-create-detail-step';
import { PetCreateHeathStep } from '@/features/pets/components/pet-actions/create-pet/pet-create-heath-step';
import type { TCreatePetInput } from '@/features/pets/schemas';
import type { TCreatePetFormStep } from '@/features/pets/schemas';

type Props = {
  step: TCreatePetFormStep;
  form: UseFormReturn<TCreatePetInput>;
};
export function CreatePetForm({ step, form }: Props) {
  return (
    <FormProvider {...form}>
      <form className="space-y-4">
        {step === 1 && <PetCreateBasicInfoStep />}
        {step === 2 && <PetCreateDetailStep />}
        {step === 3 && <PetCreateHeathStep />}
      </form>
    </FormProvider>
  );
}
