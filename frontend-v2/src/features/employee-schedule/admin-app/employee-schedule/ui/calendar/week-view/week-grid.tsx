import { WeekDayColumn } from '@/features/employee-schedule/admin-app/employee-schedule/ui/calendar/week-view/week-day-column';
import type { EmployeeScheduleCalendar } from '@/features/employee-schedule/domain/schedule.entity';
import {
  attachScheduleToWeekDays,
  buildWeekDays,
} from '@/features/employee-schedule/domain/schedule.lib';

type Props = {
  cursorDate: Date;
  days: EmployeeScheduleCalendar[];
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
