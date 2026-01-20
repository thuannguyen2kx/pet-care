import { FormProvider, type UseFormReturn } from 'react-hook-form';

import { PetCreateBasicInfoStep } from '@/features/pets/customer-app/create-pet/ui/pet-create-basic-info-step';
import { PetCreateDetailStep } from '@/features/pets/customer-app/create-pet/ui/pet-create-detail-step';
import { PetCreateHeathStep } from '@/features/pets/customer-app/create-pet/ui/pet-create-heath-step';
import type { CreatePet, CreatePetStepSchemas } from '@/features/pets/domain/pet.state';

type Props = {
  step: keyof typeof CreatePetStepSchemas;
  form: UseFormReturn<CreatePet>;
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
