import { Calendar } from 'lucide-react';
import { useParams } from 'react-router';

import { useBooking } from '@/features/booking/api/get-booking';
import { BookingDetailView } from '@/features/booking/customer-app/booking-detail/ui/booking-detail-view';
import { EmptyState } from '@/shared/components/template/empty-state';
import { SectionSpinner } from '@/shared/components/template/loading';

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const bookingQuery = useBooking({ bookingId });

  if (bookingQuery.isLoading) {
    return <SectionSpinner />;
  }

  if (!bookingQuery.data) {
    return (
      <EmptyState
        title="Không tìm thấy thông tin đặt lịch"
        description="Lịch đặt không tồn tại hoặc có thể đã bị xoá"
        icon={Calendar}
      />
    );
  }
  return <BookingDetailView booking={bookingQuery.data} />;
}
