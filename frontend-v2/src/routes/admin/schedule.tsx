import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import EmployeeScheduleListPage from '@/features/employee-schedule/admin-app/schedule-list/page';
import { getTeamScheduleQueryOptions } from '@/features/employee-schedule/api/get-team-schedule';
import { getWeekRangeFromParam } from '@/features/employee-schedule/domain/schedule.lib';
import DashboardLayout from '@/routes/admin/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url);
    const weekParam = url.searchParams.get('week');
    const { startDate, endDate } = getWeekRangeFromParam(weekParam ?? undefined);

    const query = getTeamScheduleQueryOptions(startDate, endDate);

    return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
  });
};
export default function AdminScheduleRoute() {
  return (
    <DashboardLayout
      title="Lịch làm việc của nhân viên"
      description="Xem và quản lý lịch làm việc của nhân viên"
    >
      <EmployeeScheduleListPage />
    </DashboardLayout>
  );
}
