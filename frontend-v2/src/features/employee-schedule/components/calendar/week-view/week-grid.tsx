import { WeekDayColumn } from '@/features/employee-schedule/components/calendar/week-view/week-day-column';
import { buildWeekDays } from '@/features/employee-schedule/domain/build-week-day';
import type { TCalendarScheduleDay } from '@/features/employee-schedule/domain/schedule.type';
import { attachScheduleToWeekDays } from '@/features/employee-schedule/mappers/attach-schedule-to-week-days';

type Props = {
  cursorDate: Date;
  days: TCalendarScheduleDay[];
};

export function WeekGrid({ cursorDate, days }: Props) {
  const weekDays = buildWeekDays(cursorDate);
  const calendar = attachScheduleToWeekDays(weekDays, days);

  return (
    <div className="border-border bg-card grid grid-cols-7 overflow-hidden rounded-lg border">
      {calendar.map((day) => (
        <WeekDayColumn key={day.date.toISOString()} day={day} />
      ))}
    </div>
  );
}
