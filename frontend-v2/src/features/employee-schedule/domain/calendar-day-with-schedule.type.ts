import type { TCalendarDay } from './calendar-day.type';
import type { TCalendarScheduleDay } from './schedule.type';

/**
 * SINGLE SOURCE OF TRUTH cho UI calendar
 */
export type TCalendarDayWithSchedule = TCalendarDay & {
  schedule?: TCalendarScheduleDay;
};
