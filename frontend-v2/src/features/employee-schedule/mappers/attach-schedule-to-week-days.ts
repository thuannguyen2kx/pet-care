import type { TCalendarDayWithSchedule } from '@/features/employee-schedule/domain/calendar-day-with-schedule.type';
import type { TCalendarDay } from '@/features/employee-schedule/domain/calendar-day.type';
import type { TCalendarScheduleDay } from '@/features/employee-schedule/domain/schedule.type';

export function attachScheduleToWeekDays(
  days: TCalendarDay[],
  schedules: TCalendarScheduleDay[],
): TCalendarDayWithSchedule[] {
  const scheduleMap = new Map(schedules.map((s) => [s.date.toDateString(), s]));

  return days.map((day) => ({
    ...day,
    schedule: scheduleMap.get(day.date.toDateString()),
  }));
}
