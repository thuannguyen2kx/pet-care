import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from 'date-fns';

import type { TCalendarDay } from '@/features/employee-schedule/domain/calendar-day.type';

export function buildMonthMatrix(
  cursorDate: Date,
  weekStartsOn: 1 | 0 = 1, // Monday default
): TCalendarDay[][] {
  const start = startOfWeek(startOfMonth(cursorDate), { weekStartsOn });
  const end = endOfWeek(endOfMonth(cursorDate), { weekStartsOn });

  const weeks: TCalendarDay[][] = [];
  let current = start;

  while (current <= end) {
    const week: TCalendarDay[] = [];

    for (let i = 0; i < 7; i++) {
      week.push({
        date: current,
        isCurrentMonth: isSameMonth(current, cursorDate),
        isToday: isSameDay(current, cursorDate),
      });
      current = addDays(current, 1);
    }

    weeks.push(week);
  }

  return weeks;
}
