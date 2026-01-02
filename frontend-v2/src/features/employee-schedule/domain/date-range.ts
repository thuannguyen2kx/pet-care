export type TCalendarViewMode = 'month' | 'week';

export type TDateRange = {
  startDate: Date;
  endDate: Date;
};
export interface TScheduleSearchState {
  view: TCalendarViewMode;
  date: Date;
}

export function getCalendarDateRange(cursorDate: Date, view: TCalendarViewMode): TDateRange {
  if (view === 'month') {
    return getMonthRange(cursorDate);
  }

  return getWeekRange(cursorDate);
}
export function getMonthRange(date: Date): TDateRange {
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  normalizeTime(startDate);
  normalizeTime(endDate, true);

  return { startDate, endDate };
}
export function getWeekRange(date: Date): TDateRange {
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
