import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import { getEmployeeBookingsQueryOptions } from '@/features/booking/api/get-bookings';
import { employeeBookingQuerySchema } from '@/features/booking/domain/booking.state';
import EmployeeBookingList from '@/features/booking/employee-app/booking-list/page';
import EmployeeLayout from '@/routes/employee/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url);
    const parsed = employeeBookingQuerySchema.safeParse(Object.fromEntries(url.searchParams));

    if (!parsed.success) {
      throw new Response('Invalid query params', { status: 400 });
    }
    const queryParams = parsed.data;
    const bookingsOptions = getEmployeeBookingsQueryOptions(queryParams);

    return (
      queryClient.getQueryData(bookingsOptions.queryKey) ?? queryClient.fetchQuery(bookingsOptions)
    );
  });
};
export default function EmployeeBookingsRoute() {
  return (
    <EmployeeLayout title="Lịch hẹn của tôi" description="Xem và quản lý lịch hẹn được giao">
      <EmployeeBookingList />
    </EmployeeLayout>
  );
}
