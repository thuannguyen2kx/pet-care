import { useBookingList } from '@/features/booking/customer-app/list-booking/application/use-booking-list';
import { BookingListView } from '@/features/booking/customer-app/list-booking/ui/booking-list-view';

export default function BookingListPage() {
  const bookingList = useBookingList();

  return (
    <BookingListView
      bookings={bookingList.data}
      isLoading={bookingList.isLoading}
      page={bookingList.pagination?.page ?? 1}
      totalPages={bookingList.pagination?.totalPages ?? 1}
      filter={bookingList.filter}
      onFilter={bookingList.setFilter}
    />
  );
}
