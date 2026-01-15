import type { Booking } from '@/features/booking/domain/booking.entity';
import type { EmployeeBookingQuery } from '@/features/booking/domain/booking.state';
import { EmployeeBookingListContent } from '@/features/booking/employee-app/booking-list/ui/booking-list-content';
import { EmployeeBookingFilters } from '@/features/booking/employee-app/booking-list/ui/booking-list-filter';
import { EmployeeBookingListPagination } from '@/features/booking/employee-app/booking-list/ui/booking-list-pagination';

type Props = {
  bookings: Booking[];
  isLoading: boolean;
  filter: EmployeeBookingQuery;
  page: number;
  totalPages: number;
  onFilter: (next: Partial<EmployeeBookingQuery>) => void;
};
export function EmployeeBookingListView({
  bookings,
  isLoading,
  filter,
  page,
  totalPages,
  onFilter,
}: Props) {
  return (
    <>
      <EmployeeBookingFilters filter={filter} onFilter={onFilter} />
      <EmployeeBookingListContent bookings={bookings} isLoading={isLoading} />
      <EmployeeBookingListPagination
        page={page}
        totalPages={totalPages}
        onPageChange={(page) => onFilter({ page })}
      />
    </>
  );
}
