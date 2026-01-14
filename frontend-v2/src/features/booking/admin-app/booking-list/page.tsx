import { useAdminBookingList } from '@/features/booking/admin-app/booking-list/application/use-booking-list';
import { AdminBookingListView } from '@/features/booking/admin-app/booking-list/ui/booking-list-view';

export default function AdminBookingListPage() {
  const bookingQuery = useAdminBookingList();

  const bookings = bookingQuery.data || [];
  const pagination = bookingQuery.pagination;
  return (
    <AdminBookingListView
      bookings={bookings}
      isLoading={bookingQuery.isLoading}
      page={pagination?.page ?? 1}
      totalPages={pagination?.totalPages ?? 1}
      filter={bookingQuery.filter}
      onFilter={bookingQuery.setFilter}
    />
  );
}
