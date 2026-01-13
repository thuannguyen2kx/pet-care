import {
  BookingListContent,
  type ListState,
} from '@/features/booking/customer-app/list-booking/ui/booking-list-content';
import { BookingListPagination } from '@/features/booking/customer-app/list-booking/ui/booking-list-pagination';
import { BookingListToolbar } from '@/features/booking/customer-app/list-booking/ui/booking-list-toolbar';
import type { Booking } from '@/features/booking/domain/booking.entity';
import type { CustomerBookingQuery } from '@/features/booking/domain/booking.state';

type Props = {
  bookings: Booking[];
  page: number;
  totalPages: number;
  isLoading: boolean;

  filter: CustomerBookingQuery;
  onFilter: (next: Partial<CustomerBookingQuery>) => void;
  onCancelBooking: (bookingId: string) => void;
};

export function BookingListView({
  bookings,
  isLoading,
  page,
  totalPages,
  filter,
  onFilter,
  onCancelBooking,
}: Props) {
  const listState: ListState = (() => {
    if (isLoading) {
      return { type: 'loading' };
    }
    if (bookings.length === 0) {
      return { type: 'empty' };
    }
    return {
      type: 'data',
      bookings,
    };
  })();
  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-foreground text-3xl font-bold">Lịch hẹn của tôi</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý và theo dõi các lịch hẹn dịch vụ cho thú cưng
          </p>
        </div>
        <BookingListToolbar filter={filter} onFilter={onFilter} />
        <BookingListContent state={listState} onCancelBooking={onCancelBooking} />

        <BookingListPagination
          page={page}
          totalPages={totalPages}
          onPageChange={(page) => onFilter({ page })}
        />
      </div>
    </div>
  );
}
