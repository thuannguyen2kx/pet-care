import { format, isToday } from 'date-fns';

import type { TCalendarDayWithSchedule } from '@/features/employee-schedule/domain/calendar-day-with-schedule.type';
import { cn } from '@/shared/lib/utils';

type Props = {
  day: TCalendarDayWithSchedule;
};

export function WeekDayColumn({ day }: Props) {
  const isWorking = day.schedule?.isWorking;

  return (
    <div className="flex min-h-100 flex-col border-r last:border-r-0">
      {/* Header */}
      <div
        className={cn(
          'border-b p-2 text-center font-medium',
          isToday(day.date) && 'bg-primary/10 text-primary',
        )}
      >
        <div className="text-xs">{format(day.date, 'EEE')}</div>
        <div className="text-sm">{format(day.date, 'dd/MM')}</div>
      </div>

      {/* Body */}
      <div className="flex-1 p-2 text-xs">
        {isWorking ? (
          <>
            <div className="font-medium text-green-600">
              {day.schedule?.startTime} – {day.schedule?.endTime}
            </div>

            <div className="mt-2 space-y-1">
              {day.schedule?.breaks.map((b) => (
                <div key={b.name} className="bg-muted rounded px-2 py-1">
                  {b.name}: {b.startTime}–{b.endTime}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-muted-foreground">Nghỉ</div>
        )}
      </div>
    </div>
  );
}
