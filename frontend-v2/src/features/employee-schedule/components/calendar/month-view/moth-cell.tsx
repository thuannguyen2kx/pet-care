import type { TCalendarDayWithSchedule } from '@/features/employee-schedule/domain/calendar-day-with-schedule.type';
import { cn } from '@/shared/lib/utils';

export function MonthCell({
  day,
  onClick,
}: {
  day: TCalendarDayWithSchedule;
  onClick: () => void;
}) {
  const isWorking = day.schedule?.isWorking;

  return (
    <div
      className={cn(
        'bg-background min-h-25 p-2 text-sm',
        !day.isCurrentMonth && 'text-muted-foreground bg-muted/40',
      )}
      onClick={onClick}
    >
      <div className="flex justify-between">
        <span>{day.date.getDate()}</span>
        {day.schedule?.override && <span className="text-xs text-orange-500">Override</span>}
      </div>

      {isWorking ? (
        <div className="mt-1 text-xs text-green-600">
          {day.schedule?.startTime} – {day.schedule?.endTime}
        </div>
      ) : (
        <div className="text-muted-foreground mt-1 text-xs">Nghỉ</div>
      )}
    </div>
  );
}
