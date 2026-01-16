import type { QueryClient } from '@tanstack/react-query';

import EmployeeDashboardPage from '@/features/dashboard/page';
import { getEmployeeDashboardStatsQueryOptions } from '@/features/employee/api/get-employee-dashboard-stats';
import EmployeeLayout from '@/routes/employee/layout';
import { useUser } from '@/shared/lib/auth';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async () => {
    const employeeDashboardStats = getEmployeeDashboardStatsQueryOptions();

    return (
      queryClient.getQueryData(employeeDashboardStats.queryKey) ??
      queryClient.fetchQuery(employeeDashboardStats)
    );
  });
};
export default function EmployeeDashboardRoute() {
  const user = useUser();

  return (
    <EmployeeLayout
      title={`Xin chào, ${user.data?.profile.displayName}`}
      description="Tổng quan hoạt động của bạn"
    >
      <EmployeeDashboardPage />
    </EmployeeLayout>
  );
}
