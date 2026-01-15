import { useEmployeeBookings } from '@/features/booking/api/get-bookings';
import { useEmployeeBookingListFilter } from '@/features/booking/employee-app/booking-schedule/application/use-today-booking-list-filter';

export function useEmployeeBookingList() {
  const { filters, setFilters } = useEmployeeBookingListFilter();

  const bookingsQuery = useEmployeeBookings({ query: filters });

  return {
    filters,
    setFilters,
    data: bookingsQuery.data?.bookings || [],
    pagination: bookingsQuery.data?.pagination,
    isLoading: bookingsQuery.isLoading,
  };
}
