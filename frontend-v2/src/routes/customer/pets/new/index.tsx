import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import type { FormStep } from '@/features/pets/api/create-pet';
import { CreatePet } from '@/features/pets/components/create-pet';
import { useCreatePetForm } from '@/features/pets/hooks/use-create-pet-form';
import { paths } from '@/shared/config/paths';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';

export default function CustomerPetNewRoute() {
  const [step, setStep] = useState<FormStep>(1);
  const { form, validateStep, submit, isSubmitting } = useCreatePetForm({
    onSuccess: () => setStep(1),
  });

  const progress = (step / 3) * 100;

  const handleNext = async () => {
    const isValid = await validateStep(step);
    if (!isValid) return;
    if (step < 3) {
      setStep((step + 1) as FormStep);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as FormStep);
  };

  const stepToText = (step: FormStep) => {
    switch (step) {
      case 1:
        return 'Thông tin cơ bản';
      case 2:
        return 'Thông tin thú cưng';
      case 3:
        return 'Thông tin hồ sơ';
    }
  };
  const stepToDescription = (step: FormStep) => {
    switch (step) {
      case 1:
        return 'Cho chúng tôi biết về thú cưng của bạn';
      case 2:
        return 'Thêm thông tin chi tiết để chăm sóc tốt hơn';
      case 3:
        return 'Ghi chú về sức khoẻ và dị ứng';
    }
  };
  const renderProgress = () => (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-foreground font-medium">Bước {step} / 3</span>
        <span className="text-muted-foreground">{stepToText(step)}</span>
      </div>
      <Progress className="h-2" value={progress} />
    </div>
  );
  const navigateStep = () => (
    <div className="mt-8 flex items-center justify-between">
      {step > 1 ? (
        <Button
          type="button"
          onClick={handleBack}
          variant="outline"
          className="gap-2 bg-transparent"
          disabled={isSubmitting}
        >
          <ChevronLeft className="size-4" />
          Quay lại
        </Button>
      ) : (
        <div />
      )}
      {step < 3 ? (
        <Button type="button" onClick={handleNext} disabled={isSubmitting}>
          Tiếp theo
          <ChevronRight className="size-4" />
        </Button>
      ) : (
        <Button type="submit" className="gap-2" onClick={submit} disabled={isSubmitting}>
          <Check className="size" />
          Hoàn thành
        </Button>
      )}
    </div>
  );
  return (
    <main className="container mx-auto max-w-2xl px-4 py-6">
      <Link
        to={paths.customer.pets.path}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ChevronLeft className="size-4" />
        Quay lại danh sách
      </Link>
      {renderProgress()}

      <Card className="py-4">
        <CardHeader>
          <CardTitle>{stepToDescription(step)}</CardTitle>
          <CardDescription>{stepToDescription(step)}</CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePet step={step} form={form} />
          {navigateStep()}
        </CardContent>
      </Card>
    </main>
  );
}
