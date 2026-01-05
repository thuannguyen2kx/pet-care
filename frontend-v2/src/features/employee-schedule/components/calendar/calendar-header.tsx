import { format, addMonths, subMonths, subWeeks, addWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { TCalendarViewMode } from '@/features/employee-schedule/domain/date-range';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
export type CalendarHeaderProps = {
  view: TCalendarViewMode;
  date: Date;

  onChangeDate: (date: Date) => void;
  onChangeView?: (view: TCalendarViewMode) => void;
};

export function CalendarHeader({ view, date, onChangeDate, onChangeView }: CalendarHeaderProps) {
  const goPrev = () => {
    onChangeDate(view === 'month' ? subMonths(date, 1) : subWeeks(date, 1));
  };

  const goNext = () => {
    onChangeDate(view === 'month' ? addMonths(date, 1) : addWeeks(date, 1));
  };

  const goToday = () => {
    onChangeDate(new Date());
  };

  return (
    <div className="flex items-center justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={goPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" onClick={goNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button variant="ghost" onClick={goToday}>
          Hôm nay
        </Button>
      </div>

      {/* CENTER */}
      <h2 className="text-lg font-semibold">
        {format(date, view === 'month' ? 'MMMM yyyy' : 'dd MMM yyyy')}
      </h2>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        {onChangeView && <ViewModeSwitch view={view} onChange={onChangeView} />}
      </div>
    </div>
  );
}
export function ViewModeSwitch({
  view,
  onChange,
}: {
  view: TCalendarViewMode;
  onChange: (view: TCalendarViewMode) => void;
}) {
  return (
    <div className="border-border flex rounded-md border p-1">
      <button
        onClick={() => onChange('month')}
        className={cn(
          'rounded px-3 py-1 text-sm',
          view === 'month' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
        )}
      >
        Tháng
      </button>

      <button
        onClick={() => onChange('week')}
        className={cn(
          'rounded px-3 py-1 text-sm',
          view === 'week' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
        )}
      >
        Tuần
      </button>
    </div>
  );
}
