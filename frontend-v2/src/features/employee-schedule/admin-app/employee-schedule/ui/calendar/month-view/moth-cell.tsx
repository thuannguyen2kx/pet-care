import { AlertCircle, Clock, Coffee } from 'lucide-react';

import type { CalendarDayWithSchedule } from '@/features/employee-schedule/domain/schedule.entity';
import { cn } from '@/shared/lib/utils';

export function MonthCell({ day, onClick }: { day: CalendarDayWithSchedule; onClick: () => void }) {
  const schedule = day.schedule;
  const isWorking = schedule?.isWorking;
  const hasBreaks = (schedule?.breaks?.length ?? 0) > 0;

  const isOverride = schedule?.override;

  return (
    <div
      onClick={onClick}
      className={cn(
        'min-h-28 cursor-pointer p-2.5 text-sm transition-colors',
        'hover:bg-muted/60',
        !day.isCurrentMonth && 'bg-muted/40 text-muted-foreground',
        day.isToday && 'bg-primary/10',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <span className="font-medium">{day.date.getDate()}</span>

        {isOverride && (
          <span
            className="text-destructive flex items-center gap-1 text-xs"
            title={schedule?.override?.reason}
          >
            <AlertCircle className="h-3 w-3" />
            Lịch điều chỉnh
          </span>
        )}
      </div>

      {/* Content */}
      {isWorking ? (
        <div className="mt-1 space-y-1">
          <div className="flex items-center gap-1 text-xs text-green-600">
            <Clock className="h-3 w-3" />
            {schedule?.startTime} – {schedule?.endTime}
          </div>

          {hasBreaks && (
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <Coffee className="h-3 w-3" />
              {schedule!.breaks.length} lần nghỉ
            </div>
          )}
        </div>
      ) : (
        <div className="text-muted-foreground mt-1 text-xs">
          {isOverride ? 'Nghỉ (Lịch điều chỉnh)' : 'Nghỉ'}
        </div>
      )}
    </div>
  );
}
