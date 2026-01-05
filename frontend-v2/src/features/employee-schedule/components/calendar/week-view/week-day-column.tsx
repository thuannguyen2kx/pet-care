import { format, isToday } from 'date-fns';
import { vi } from 'date-fns/locale';

import { StatusBadge } from '@/features/employee-schedule/components/day-detail/status-badge';
import type { TCalendarDayWithSchedule } from '@/features/employee-schedule/domain/calendar-day-with-schedule.type';
import { cn } from '@/shared/lib/utils';

type Props = {
  day: TCalendarDayWithSchedule;
};

export function WeekDayColumn({ day }: Props) {
  const schedule = day.schedule;

  return (
    <div className="border-border flex min-h-100 flex-col border-r last:border-r-0">
      {/* Header */}
      <div
        className={cn(
          'border-border border-b p-2 text-center font-medium',
          isToday(day.date) && 'bg-primary/10 text-primary',
        )}
      >
        <div className="text-xs">{format(day.date, 'EEE', { locale: vi })}</div>
        <div className="text-sm">{format(day.date, 'dd/MM', { locale: vi })}</div>
      </div>

      {/* Body */}
      <div className="flex-1 space-y-1 p-2 text-xs">
        {!schedule && <div className="text-muted-foreground italic">Chưa có lịch</div>}

        {schedule && (
          <>
            <StatusBadge schedule={schedule} />

            {schedule.isWorking ? (
              <>
                <div className="font-medium text-green-600">
                  {schedule.startTime} – {schedule.endTime}
                </div>

                {schedule.breaks?.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {schedule.breaks.map((b) => (
                      <div key={b.name} className="bg-muted rounded px-2 py-1">
                        {b.name}: {b.startTime}–{b.endTime}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-muted-foreground">Ngày nghỉ</div>
            )}

            {schedule.override && (
              <div className="text-[10px] text-orange-500">Lịch điều chỉnh</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
