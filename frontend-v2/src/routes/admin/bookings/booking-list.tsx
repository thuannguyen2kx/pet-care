import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import AdminBookingListPage from '@/features/booking/admin-app/booking-list/page';
import { getBookingStatisticQueryOptions } from '@/features/booking/api/get-booking-statistic';
import { getAdminBookingsQueryOptions } from '@/features/booking/api/get-bookings';
import { adminBookingQuerySchema } from '@/features/booking/domain/booking.state';
import DashboardLayout from '@/routes/admin/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url);

    const parsed = adminBookingQuerySchema.safeParse(Object.fromEntries(url.searchParams));

    if (!parsed.success) {
      throw new Response('Invalid query params', { status: 400 });
    }

    const queryParams = parsed.data;

    const statisticQuery = getBookingStatisticQueryOptions();
    const bookingsQuery = getAdminBookingsQueryOptions(queryParams);

    await Promise.all([
      queryClient.ensureQueryData(statisticQuery),
      queryClient.ensureQueryData(bookingsQuery),
    ]);

    return null;
  });
};

export default function AdminBookingListRoute() {
  return (
    <DashboardLayout title="Quản lý lịch hen" description="Xem và quản lý tất cả lịch đặt dịch vụ">
      <AdminBookingListPage />
    </DashboardLayout>
  );
}
