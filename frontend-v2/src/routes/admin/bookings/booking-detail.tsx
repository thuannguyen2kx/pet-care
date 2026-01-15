import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import AdminBookingDetailPage from '@/features/booking/admin-app/booking-detail/page';
import { getAdminBookingQueryOptions } from '@/features/booking/api/get-booking';
import DashboardLayout from '@/routes/admin/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ params }: ClientLoaderFunctionArgs) => {
    const bookingId = params.bookingId as string;
    const query = getAdminBookingQueryOptions(bookingId);
    return queryClient.getQueryData(query.queryKey) ?? queryClient.fetchQuery(query);
  });
};
export default function AdminBookingDetailRoute() {
  return (
    <DashboardLayout title="Quản lý đặt lịch" description="Xem và quản lý chi tiết đặt lịch">
      <AdminBookingDetailPage />
    </DashboardLayout>
  );
}
