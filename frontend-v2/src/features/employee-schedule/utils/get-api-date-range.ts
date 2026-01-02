import { getMonthRange, getWeekRange } from '@/features/employee-schedule/domain/date-range';

export function getApiDateRange(baseDate: Date, view: 'month' | 'week') {
  return view === 'week' ? getWeekRange(baseDate) : getMonthRange(baseDate);
}
