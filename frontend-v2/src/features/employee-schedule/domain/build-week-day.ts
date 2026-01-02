import { startOfWeek, addDays, isSameDay } from 'date-fns';

import type { TCalendarDay } from '@/features/employee-schedule/domain/calendar-day.type';

export function buildWeekDays(cursorDate: Date, weekStartsOn: 1 | 0 = 1): TCalendarDay[] {
  const start = startOfWeek(cursorDate, { weekStartsOn });

  return Array.from({ length: 7 }).map((_, i) => ({
    date: addDays(start, i),
    isToday: isSameDay(addDays(start, i), cursorDate),
  }));
}
