import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/shared/ui/button';

type Props = {
  canBack: boolean;
  canNext: boolean;
  isLastStep: boolean;
  isConfirming: boolean;

  onBack: () => void;
  onNext: () => void;
  onConfirm: () => void;
};
export function CreateBookingNavigation(props: Props) {
  const { canBack, canNext, isLastStep, isConfirming, onBack, onNext, onConfirm } = props;

  return (
    <div className="border-border bg-secondary/30 flex items-center justify-between border-t px-6 py-4 sm:px-8">
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={!canBack}
        className="cursor-pointer gap-2 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
        Quay lại
      </Button>

      {!isLastStep ? (
        <Button
          onClick={onNext}
          disabled={!canNext}
          className="cursor-pointer gap-2 disabled:cursor-not-allowed"
        >
          Tiếp tục
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          onClick={onConfirm}
          disabled={isConfirming}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          {isConfirming ? (
            <>
              <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Xác nhận đặt lịch
            </>
          )}
        </Button>
      )}
    </div>
  );
}
