import { Calendar } from 'lucide-react';
import { useParams } from 'react-router';

import { AdminUpdateBookingStatusDialog } from '@/features/booking/admin-app/booking-detail/dialog/update-booking-status-dialog';
import { useUpdateBookingStatusController } from '@/features/booking/admin-app/booking-detail/dialog/use-update-booking-status-controller';
import { AdminBookingDetailView } from '@/features/booking/admin-app/booking-detail/ui/booking-detail-view';
import { useAdminBooking } from '@/features/booking/api/get-booking';
import { EmptyState } from '@/shared/components/template/empty-state';
import { SectionSpinner } from '@/shared/components/template/loading';

export default function AdminBookingDetailPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;

  const bookingQuery = useAdminBooking({ bookingId });
  const updateBookingStatusController = useUpdateBookingStatusController();

  if (bookingQuery.isLoading) {
    return <SectionSpinner />;
  }
  if (!bookingQuery.data) {
    return (
      <EmptyState
        title="Lịch đặt không tồn tại"
        description="Thông tin lịch đặt không tìm thấy hoặc có thể đã bị xoá"
        icon={Calendar}
      />
    );
  }
  return (
    <>
      <AdminBookingDetailView
        booking={bookingQuery.data}
        onUpdateBookingStatus={updateBookingStatusController.actions.openUpdateBookingStatusDialog}
      />
      {updateBookingStatusController.state.isOpen && (
        <AdminUpdateBookingStatusDialog
          open={updateBookingStatusController.state.isOpen}
          onOpenChange={updateBookingStatusController.actions.onOpenChange}
          form={updateBookingStatusController.form}
          allowedStatuses={updateBookingStatusController.data.allowedStatuses}
          onSubmit={updateBookingStatusController.actions.submitUpdateBookingStatus}
          isSubmitting={updateBookingStatusController.state.isSubmitting}
        />
      )}
    </>
  );
}
