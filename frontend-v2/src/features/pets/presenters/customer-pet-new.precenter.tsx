import { useState } from 'react';

import { CreatePetForm } from '@/features/pets/components/pet-actions/create-pet';
import { StepNavigation } from '@/features/pets/components/pet-actions/create-pet/step-navigation';
import { StepProgress } from '@/features/pets/components/pet-actions/create-pet/step-progress';
import { useCreatePetForm } from '@/features/pets/components/pet-actions/create-pet/use-create-pet';
import { CREATE_PET_STEP_CONFIG } from '@/features/pets/constants';
import type { TCreatePetFormStep } from '@/features/pets/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export function CustomerPetNewPrecenter() {
  const [step, setStep] = useState<TCreatePetFormStep>(1);
  const { form, validateStep, submit, isSubmitting } = useCreatePetForm({
    onSuccess: () => setStep(1),
  });

  const progress = (step / 3) * 100;

  const next = async () => {
    if (!(await validateStep(step))) return;
    setStep((s) => Math.min(s + 1, 3) as TCreatePetFormStep);
  };

  const back = () => setStep((s) => Math.max(s - 1, 1) as TCreatePetFormStep);
  const { title, description } = CREATE_PET_STEP_CONFIG[step];
  return (
    <>
      <StepProgress title={title} step={step} progress={progress} />
      <Card className="py-4">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePetForm form={form} step={step} />
          <StepNavigation
            step={step}
            onNext={next}
            onBack={back}
            onSubmit={submit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </>
  );
}
