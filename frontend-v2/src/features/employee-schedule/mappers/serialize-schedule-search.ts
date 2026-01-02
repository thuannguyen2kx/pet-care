import type { TScheduleSearchState } from '@/features/employee-schedule/domain/date-range';

export function serializeScheduleSearch(state: TScheduleSearchState) {
  return {
    view: state.view,
    date: state.date.toISOString().split('T')[0],
  };
}
