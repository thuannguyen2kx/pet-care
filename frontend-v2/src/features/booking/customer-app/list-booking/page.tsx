import { useBookingList } from '@/features/booking/customer-app/list-booking/application/use-booking-list';
import { CancelBookingDialog } from '@/features/booking/customer-app/list-booking/dialog/cancel-booking/cancel-booking-dialog';
import { useCancelBookingController } from '@/features/booking/customer-app/list-booking/dialog/cancel-booking/use-cancel-booking.controller';
import { BookingListView } from '@/features/booking/customer-app/list-booking/ui/booking-list-view';

export default function BookingListPage() {
  const bookingList = useBookingList();
  const cancelBookingController = useCancelBookingController();
  return (
    <>
      <BookingListView
        bookings={bookingList.data}
        isLoading={bookingList.isLoading}
        page={bookingList.pagination?.page ?? 1}
        totalPages={bookingList.pagination?.totalPages ?? 1}
        filter={bookingList.filter}
        onFilter={bookingList.setFilter}
        onCancelBooking={cancelBookingController.actions.openCancelDialog}
      />
      <CancelBookingDialog
        open={cancelBookingController.state.isOpen}
        onOpenChange={cancelBookingController.actions.onOpenChange}
        form={cancelBookingController.form}
        onSubmit={cancelBookingController.actions.submitCancelBooking}
        isSubmitting={cancelBookingController.state.isSubmitting}
      />
    </>
  );
}
