import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import { getEmployeeBookingScheduleQueryOptions } from '@/features/booking/api/get-booking-schedule';
import { getEmployeeBookingTodayStatisticQueryOptions } from '@/features/booking/api/get-booking-statistic-today';
import { employeeBookingScheduleQuery } from '@/features/booking/domain/booking.state';
import EmployeeBookingSchedulePage from '@/features/booking/employee-app/booking-schedule/page';
import EmployeeLayout from '@/routes/employee/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url);
    const parser = employeeBookingScheduleQuery.safeParse(Object.fromEntries(url.searchParams));

    if (!parser.success) {
      throw new Response('Invalid query params', { status: 400 });
    }
    const scheduleQuery = parser.data;
    const todayStatisticOptions = getEmployeeBookingTodayStatisticQueryOptions();
    const employeeBookingScheduleOptions = getEmployeeBookingScheduleQueryOptions(scheduleQuery);

    await Promise.all([
      queryClient.ensureQueryData(todayStatisticOptions),
      queryClient.ensureQueryData(employeeBookingScheduleOptions),
    ]);

    return null;
  });
};
export default function EmployeeScheduleRoute() {
  return (
    <EmployeeLayout title="Lịch làm việc" description="Xem và quản lý lịch hẹn của bạn">
      <EmployeeBookingSchedulePage />
    </EmployeeLayout>
  );
}
