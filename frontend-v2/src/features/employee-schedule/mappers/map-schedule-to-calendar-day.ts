import type {
  TCalendarScheduleDay,
  TEmployeeScheduleDay,
} from '@/features/employee-schedule/domain/schedule.type';

export function mapScheduleToCalendarDays(days: TEmployeeScheduleDay[]): TCalendarScheduleDay[] {
  return days.map((d) => ({
    ...d,
    date: new Date(d.date),
  }));
}
