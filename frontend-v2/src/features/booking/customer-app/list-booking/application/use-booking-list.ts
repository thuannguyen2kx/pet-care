import { useBookings } from '@/features/booking/api/get-bookings';
import { useBookingListFilter } from '@/features/booking/customer-app/list-booking/application/use-booking-list-filter';

export const useBookingList = () => {
  const { filters, setFilters } = useBookingListFilter();
  const bookingsQuery = useBookings({ query: filters });

  return {
    isLoading: bookingsQuery.isLoading,
    data: bookingsQuery.data?.bookings || [],
    pagination: bookingsQuery.data?.pagination,
    filter: filters,
    setFilter: setFilters,
  };
};
