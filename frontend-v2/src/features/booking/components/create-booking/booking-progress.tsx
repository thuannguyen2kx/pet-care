import { Check } from 'lucide-react';

import type { BookingStepId, BookingStepMeta } from '@/features/booking/domain/booking-step';
import { cn } from '@/shared/lib/utils';

type Props = {
  steps: BookingStepMeta[];
  currentStep: BookingStepId;
};
export function CreateBookingProgress({ steps, currentStep }: Props) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  const progress = steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="relative mb-16">
      <div className="mx-auto max-w-4xl">
        <div className="bg-muted absolute top-6 right-0 left-0 h-px" />
        <div
          className="bg-primary absolute top-6 left-0 h-px transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
        <div className="relative flex justify-between">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = step.id === currentStep;
            return (
              <div key={step.id} className={cn('group flex flex-col items-center gap-4')}>
                <div
                  className={cn(
                    'relative z-10 flex h-12 w-12 items-center justify-center border transition-all duration-300',
                    !isCurrent && 'border-muted bg-secondary text-primary-foreground',
                    isCurrent && 'border-primary bg-primary text-primary-foreground',
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-mono text-lg font-bold">{step.order}</span>
                  )}
                </div>
                <div className="max-w-36 text-center">
                  <p
                    className={cn(
                      'text-xs tracking-wider uppercase transition-colors duration-300',
                      isCompleted || isCurrent ? 'text-primary' : 'text-muted-foreground',
                    )}
                  >
                    {step.name}
                  </p>
                  <p className="text-muted-foreground mt-1.5 hidden text-xs leading-tight sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
