import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  parseISO,
  format,
} from 'date-fns';

import type {
  CalendarDayWithSchedule,
  EmployeeScheduleCalendar,
} from '@/features/employee-schedule/domain/schedule.entity';

export type CalendarDay = {
  date: Date;

  /** UI concern */
  isToday: boolean;
  isCurrentMonth?: boolean;
};

export function buildMonthMatrix(
  cursorDate: Date,
  weekStartsOn: 1 | 0 = 1, // Monday default
): CalendarDay[][] {
  const start = startOfWeek(startOfMonth(cursorDate), { weekStartsOn });
  const end = endOfWeek(endOfMonth(cursorDate), { weekStartsOn });

  const weeks: CalendarDay[][] = [];
  let current = start;

  while (current <= end) {
    const week: CalendarDay[] = [];

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

export function buildWeekDays(cursorDate: Date, weekStartsOn: 1 | 0 = 1): CalendarDay[] {
  const start = startOfWeek(cursorDate, { weekStartsOn });

  return Array.from({ length: 7 }).map((_, i) => ({
    date: addDays(start, i),
    isToday: isSameDay(addDays(start, i), cursorDate),
  }));
}

export type CalendarViewMode = 'month' | 'week';

export type DateRange = {
  startDate: Date;
  endDate: Date;
};
export interface ScheduleSearchState {
  view: CalendarViewMode;
  date: Date;
}

export function getCalendarDateRange(cursorDate: Date, view: CalendarViewMode): DateRange {
  if (view === 'month') {
    return getMonthRange(cursorDate);
  }

  return getWeekRange(cursorDate);
}
export function getMonthRange(date: Date): DateRange {
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  normalizeTime(startDate);
  normalizeTime(endDate, true);

  return { startDate, endDate };
}
export function getWeekRange(date: Date): DateRange {
  const day = date.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;

  const startDate = new Date(date);
  startDate.setDate(date.getDate() + diff);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  normalizeTime(startDate);
  normalizeTime(endDate, true);

  return { startDate, endDate };
}
export function normalizeTime(date: Date, end = false) {
  if (end) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }
}
export function getApiDateRange(baseDate: Date, view: 'month' | 'week') {
  return view === 'week' ? getWeekRange(baseDate) : getMonthRange(baseDate);
}

function parseView(value: string | null): CalendarViewMode {
  return value === 'week' ? 'week' : 'month';
}

function parseDate(value: string | null): Date {
  if (!value) return new Date();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function parseScheduleSearch(searchParams: URLSearchParams): ScheduleSearchState {
  return {
    view: parseView(searchParams.get('view')),
    date: parseDate(searchParams.get('date')),
  };
}
export function getWeekRangeFromParam(weekParam?: string) {
  const baseDate = weekParam ? parseISO(weekParam) : new Date();

  const start = startOfWeek(baseDate, { weekStartsOn: 1 });
  const end = endOfWeek(baseDate, { weekStartsOn: 1 });

  return {
    startDate: format(start, 'yyyy-MM-dd'),
    endDate: format(end, 'yyyy-MM-dd'),
    start,
    end,
  };
}
export function mapDateRangeToApiParams(range: { startDate: Date; endDate: Date }) {
  return {
    startDate: range.startDate.toISOString(),
    endDate: range.endDate.toISOString(),
  };
}
export function attachScheduleToWeekDays(
  days: CalendarDay[],
  schedules: EmployeeScheduleCalendar[],
): CalendarDayWithSchedule[] {
  const scheduleMap = new Map(schedules.map((s) => [s.date.toDateString(), s]));

  return days.map((day) => ({
    ...day,
    schedule: scheduleMap.get(day.date.toDateString()),
  }));
}
export function attachScheduleToCalendarMatrix(
  matrix: CalendarDay[][],
  schedules: EmployeeScheduleCalendar[],
): CalendarDayWithSchedule[][] {
  const map = new Map(schedules.map((d) => [d.date.toDateString(), d]));

  return matrix.map((week) =>
    week.map((day) => ({
      ...day,
      schedule: map.get(day.date.toDateString()),
    })),
  );
}
