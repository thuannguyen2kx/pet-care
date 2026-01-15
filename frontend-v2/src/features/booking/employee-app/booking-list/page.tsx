import { useEmployeeBookingList } from '@/features/booking/employee-app/booking-list/application/use-employee-booking-list';
import { EmployeeBookingListView } from '@/features/booking/employee-app/booking-list/ui/booking-list-view';

export default function EmployeeBookingList() {
  const bookingsCtrl = useEmployeeBookingList();

  return (
    <EmployeeBookingListView
      bookings={bookingsCtrl.data}
      isLoading={bookingsCtrl.isLoading}
      filter={bookingsCtrl.filters}
      page={bookingsCtrl.pagination?.page ?? 1}
      totalPages={bookingsCtrl.pagination?.totalPages ?? 1}
      onFilter={bookingsCtrl.setFilters}
    />
  );
}
