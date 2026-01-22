import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

import type { CreatePetStepSchemas } from '@/features/pets/domain/pet.state';
import { Button } from '@/shared/ui/button';

type Props = {
  step: keyof typeof CreatePetStepSchemas;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};
export function StepNavigation({ step, onNext, onBack, onSubmit, isSubmitting }: Props) {
  return (
    <div className="mt-8 flex items-center justify-between">
      {step > 1 ? (
        <Button
          type="button"
          onClick={onBack}
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
        <Button type="button" onClick={onNext} disabled={isSubmitting}>
          Tiếp theo
          <ChevronRight className="size-4" />
        </Button>
      ) : (
        <Button type="submit" className="gap-2" onClick={onSubmit} disabled={isSubmitting}>
          <Check className="size" />
          Hoàn thành
        </Button>
      )}
    </div>
  );
}
