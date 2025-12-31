import type { TEmployeeFilter } from '@/features/employee/shemas';

export function employeeFilterToSearchParams(filter: TEmployeeFilter): URLSearchParams {
  const params = new URLSearchParams();

  if (filter.specialty && filter.specialty) {
    params.set('specialty', filter.specialty);
  }

  if (filter.isAcceptingBookings !== undefined) {
    params.set('isAcceptingBookings', String(filter.isAcceptingBookings));
  }

  if (filter.page && filter.page !== 1) {
    params.set('page', String(filter.page));
  }

  if (filter.limit && filter.limit !== 20) {
    params.set('limit', String(filter.limit));
  }

  return params;
}
