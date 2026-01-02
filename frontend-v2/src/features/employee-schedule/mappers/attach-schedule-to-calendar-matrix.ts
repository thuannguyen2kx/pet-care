import type { TCalendarDayWithSchedule } from '@/features/employee-schedule/domain/calendar-day-with-schedule.type';
import type { TCalendarDay } from '@/features/employee-schedule/domain/calendar-day.type';
import type { TCalendarScheduleDay } from '@/features/employee-schedule/domain/schedule.type';

export function attachScheduleToCalendarMatrix(
  matrix: TCalendarDay[][],
  schedules: TCalendarScheduleDay[],
): TCalendarDayWithSchedule[][] {
  const map = new Map(schedules.map((d) => [d.date.toDateString(), d]));

  return matrix.map((week) =>
    week.map((day) => ({
      ...day,
      schedule: map.get(day.date.toDateString()),
    })),
  );
}
