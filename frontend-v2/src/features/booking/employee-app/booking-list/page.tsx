import { useEmployeeBookingList } from '@/features/booking/employee-app/booking-list/application/use-employee-booking-list';
import { EmployeeBookingDetailDialog } from '@/features/booking/employee-app/booking-list/dialog/booking-detail/booking-detail-dialog';
import { useEmployeeBookingDetailDialog } from '@/features/booking/employee-app/booking-list/dialog/booking-detail/use-booking-detail-dialog';
import { EmployeeUpdateBookingStatusDialog } from '@/features/booking/employee-app/booking-list/dialog/update-status/update-booking-status-dialog';
import { useEmployeeUpdateBookingStatusController } from '@/features/booking/employee-app/booking-list/dialog/update-status/use-update-booking-status-controller';
import { EmployeeBookingListView } from '@/features/booking/employee-app/booking-list/ui/booking-list-view';

export default function EmployeeBookingList() {
  const bookingsCtrl = useEmployeeBookingList();
  const bookingDetailCtrl = useEmployeeBookingDetailDialog();

  const updateBookingStatusCtrl = useEmployeeUpdateBookingStatusController();

  return (
    <>
      <EmployeeBookingListView
        bookings={bookingsCtrl.data}
        isLoading={bookingsCtrl.isLoading}
        filter={bookingsCtrl.filters}
        page={bookingsCtrl.pagination?.page ?? 1}
        totalPages={bookingsCtrl.pagination?.totalPages ?? 1}
        onFilter={bookingsCtrl.setFilters}
        onViewDetail={bookingDetailCtrl.actions.open}
      />
      <EmployeeBookingDetailDialog
        open={bookingDetailCtrl.state.isOpen}
        onOpenChange={bookingDetailCtrl.actions.onOpenChange}
        booking={bookingDetailCtrl.data.booking}
        isLoading={bookingDetailCtrl.state.isLoading}
        onUpdateBookingStatus={updateBookingStatusCtrl.actions.openUpdateBookingStatusDialog}
      />
      <EmployeeUpdateBookingStatusDialog
        open={updateBookingStatusCtrl.state.isOpen}
        onOpenChange={updateBookingStatusCtrl.actions.onOpenChange}
        form={updateBookingStatusCtrl.form}
        allowedStatuses={updateBookingStatusCtrl.data.allowedStatuses}
        onSubmit={updateBookingStatusCtrl.actions.submitUpdateBookingStatus}
        isSubmitting={updateBookingStatusCtrl.state.isSubmitting}
      />
    </>
  );
}
