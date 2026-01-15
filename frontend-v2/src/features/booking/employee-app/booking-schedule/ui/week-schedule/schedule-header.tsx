import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { CardTitle } from '@/shared/ui/card';

export function ScheduleHeader({
  isCurrentWeek,
  onPrev,
  onNext,
  onToday,
  weekRangeLabel,
}: {
  isCurrentWeek: boolean;
  weekRangeLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="text-lg">Lịch tuần</CardTitle>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="w-32 text-center text-sm font-medium">{weekRangeLabel}</span>

        <Button variant="outline" size="icon" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>

        {!isCurrentWeek && (
          <Button variant="ghost" size="sm" onClick={onToday}>
            Hôm nay
          </Button>
        )}
      </div>
    </div>
  );
}
