import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import { getEmployeeScheduleQueryOptions } from '@/features/employee-schedule/api/get-employee-schedule';
import EmployeeScheduleContainer from '@/features/employee-schedule/containers/employee-schedule.container';
import { getApiDateRange } from '@/features/employee-schedule/utils/get-api-date-range';
import { parseScheduleSearch } from '@/features/employee-schedule/utils/parse-schedule-search';
import DashboardLayout from '@/routes/admin/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ params, request }: ClientLoaderFunctionArgs) => {
    const employeeId = params.employeeId as string;

    const url = new URL(request.url);
    const { view, date } = parseScheduleSearch(url.searchParams);
    const { startDate, endDate } = getApiDateRange(date, view);

    const query = getEmployeeScheduleQueryOptions({
      employeeId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    return queryClient.getQueryData(query.queryKey) ?? queryClient.fetchQuery(query);
  });
};
export default function AdminEmployeeScheduleRoute() {
  return (
    <DashboardLayout
      title="Lịch làm việc của nhân viên"
      description="Xem và quản lý thông tin lịch làm việc của nhân viên"
    >
      <EmployeeScheduleContainer />
    </DashboardLayout>
  );
}
