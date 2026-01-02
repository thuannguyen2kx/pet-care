import type {
  TCalendarViewMode,
  TScheduleSearchState,
} from '@/features/employee-schedule/domain/date-range';

function parseView(value: string | null): TCalendarViewMode {
  return value === 'week' ? 'week' : 'month';
}

function parseDate(value: string | null): Date {
  if (!value) return new Date();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function parseScheduleSearch(searchParams: URLSearchParams): TScheduleSearchState {
  return {
    view: parseView(searchParams.get('view')),
    date: parseDate(searchParams.get('date')),
  };
}
