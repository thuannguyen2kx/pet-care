import type { EmployeeSchedule } from '@/features/employee/domain/employee.entity';
import type {
  TCalendarScheduleDay,
  TDayOfWeek,
} from '@/features/employee-schedule/domain/schedule.type';

export function mapScheduleToCalendarDays(days: EmployeeSchedule[]): TCalendarScheduleDay[] {
  return days.map((d) => ({
    ...d,
    dayOfWeek: d.dayOfWeek as TDayOfWeek,
    date: new Date(d.date),
  }));
}
