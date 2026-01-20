import { useState } from 'react';

import { getCreatePetStepConfig } from '@/features/pets/config';
import { useCreatePetForm } from '@/features/pets/customer-app/create-pet/application/use-create-pet';
import { CreatePetForm } from '@/features/pets/customer-app/create-pet/ui/create-pet.form';
import { StepNavigation } from '@/features/pets/customer-app/create-pet/ui/step-navigation';
import { StepProgress } from '@/features/pets/customer-app/create-pet/ui/step-progress';
import type { CreatePetStepSchemas } from '@/features/pets/domain/pet.state';
import { BackLink } from '@/shared/components/template/back-link';
import { paths } from '@/shared/config/paths';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export default function CreatePetPage() {
  const [step, setStep] = useState<keyof typeof CreatePetStepSchemas>(1);
  const { form, validateStep, submit, isSubmitting } = useCreatePetForm({
    onSuccess: () => setStep(1),
  });

  const progress = (step / 3) * 100;

  const next = async () => {
    if (!(await validateStep(step))) return;
    setStep((s) => Math.min(s + 1, 3) as keyof typeof CreatePetStepSchemas);
  };

  const back = () => setStep((s) => Math.max(s - 1, 1) as keyof typeof CreatePetStepSchemas);
  const { title, description } = getCreatePetStepConfig(step);
  return (
    <main className="container mx-auto max-w-2xl px-4 py-6">
      <BackLink to={paths.customer.pets.path} label="Quay lại danh sách" />
      <StepProgress title={title} step={step} progress={progress} />
      <Card className="rounded-none border-none p-4 shadow-none">
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
    </main>
  );
}
