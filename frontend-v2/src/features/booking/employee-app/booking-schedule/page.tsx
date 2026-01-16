import { EmployeeBookingDetailDialog } from '@/features/booking/employee-app/booking-schedule/dialog/booking-detail/booking-detail-dialog';
import { useEmployeeBookingDetailDialog } from '@/features/booking/employee-app/booking-schedule/dialog/booking-detail/use-booking-detail-dialog';
import { EmployeeBookingScheduleView } from '@/features/booking/employee-app/booking-schedule/ui/booking-schedule-view';

export default function EmployeeBookingSchedulePage() {
  const bookingDetailCtrl = useEmployeeBookingDetailDialog();

  return (
    <>
      <EmployeeBookingScheduleView onViewDetail={bookingDetailCtrl.actions.open} />
      <EmployeeBookingDetailDialog
        open={bookingDetailCtrl.state.isOpen}
        onOpenChange={bookingDetailCtrl.actions.onOpenChange}
        booking={bookingDetailCtrl.data.booking}
        isLoading={bookingDetailCtrl.state.isLoading}
      />
    </>
  );
}
