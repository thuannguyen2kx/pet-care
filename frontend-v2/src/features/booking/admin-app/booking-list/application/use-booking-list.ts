import { useAdminBookingListFilter } from '@/features/booking/admin-app/booking-list/application/use-booking-list-filter';
import { useAdminBookings } from '@/features/booking/api/get-bookings';

export const useAdminBookingList = () => {
  const { filters, setFilters } = useAdminBookingListFilter();
  const bookingsQuery = useAdminBookings({ query: filters });

  return {
    isLoading: bookingsQuery.isLoading,
    data: bookingsQuery.data?.bookings || [],
    pagination: bookingsQuery.data?.pagination,
    filter: filters,
    setFilter: setFilters,
  };
};
