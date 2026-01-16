import { EmployeeBookingDetailDialog } from '@/features/booking/employee-app/booking-schedule/dialog/booking-detail/booking-detail-dialog';
import { useEmployeeBookingDetailDialog } from '@/features/booking/employee-app/booking-schedule/dialog/booking-detail/use-booking-detail-dialog';
import { EmployeeUpdateBookingStatusDialog } from '@/features/booking/employee-app/booking-schedule/dialog/update-status/update-booking-status-dialog';
import { useEmployeeUpdateBookingStatusController } from '@/features/booking/employee-app/booking-schedule/dialog/update-status/use-update-booking-status-controller';
import { EmployeeBookingScheduleView } from '@/features/booking/employee-app/booking-schedule/ui/booking-schedule-view';

export default function EmployeeBookingSchedulePage() {
  const bookingDetailCtrl = useEmployeeBookingDetailDialog();
  const updateBookingStatusCtrl = useEmployeeUpdateBookingStatusController();
  return (
    <>
      <EmployeeBookingScheduleView onViewDetail={bookingDetailCtrl.actions.open} />
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
