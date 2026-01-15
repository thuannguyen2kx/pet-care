import { Calendar } from 'lucide-react';
import { useParams } from 'react-router';

import { AdminBookingDetailView } from '@/features/booking/admin-app/booking-detail/ui/booking-detail-view';
import { useAdminBooking } from '@/features/booking/api/get-booking';
import { EmptyState } from '@/shared/components/template/empty-state';
import { SectionSpinner } from '@/shared/components/template/loading';

export default function AdminBookingDetailPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;

  const bookingQuery = useAdminBooking({ bookingId });

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
  return <AdminBookingDetailView booking={bookingQuery.data} />;
}
