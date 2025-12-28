import type { TCreatePetFormStep } from '@/features/pets/schemas';
import { Progress } from '@/shared/ui/progress';

type Props = {
  title: string;
  step: TCreatePetFormStep;
  progress: number;
};
export function StepProgress({ title, step, progress }: Props) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-foreground font-medium">Bước {step} / 3</span>
        <span className="text-muted-foreground">{title}</span>
      </div>
      <Progress className="h-2" value={progress} />
    </div>
  );
}
