import { AdminBookingFilters } from '@/features/booking/admin-app/booking-list/ui/booking-filter';
import { BookingListContent } from '@/features/booking/admin-app/booking-list/ui/booking-list-content';
import { AdminBookingListPagination } from '@/features/booking/admin-app/booking-list/ui/booking-list-pagination';
import { StatsOverview } from '@/features/booking/admin-app/booking-list/widgets/stats-overview';
import type { Booking } from '@/features/booking/domain/booking.entity';
import type { AdminBookingQuery } from '@/features/booking/domain/booking.state';

type Props = {
  bookings: Booking[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  filter: AdminBookingQuery;
  onFilter: (next: Partial<AdminBookingQuery>) => void;
};
export function AdminBookingListView({
  bookings,
  isLoading,
  page,
  totalPages,
  filter,
  onFilter,
}: Props) {
  return (
    <>
      <StatsOverview />
      <AdminBookingFilters filter={filter} onFilter={onFilter} />
      <BookingListContent bookings={bookings} isLoading={isLoading} />
      <AdminBookingListPagination
        page={page}
        totalPages={totalPages}
        onPageChange={(page) => onFilter({ page })}
      />
    </>
  );
}
