import type { QueryClient } from '@tanstack/react-query';

import AdminDashboardPage from '@/features/dashboard/admin-app/page';
import { getAdminDashboardStatQueryOptions } from '@/features/report/api/get-admin-dashboard-stat';
import DashboardLayout from '@/routes/admin/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async () => {
    const statOptions = getAdminDashboardStatQueryOptions();

    return (
      queryClient.getQueryData(statOptions.queryKey) ?? (await queryClient.fetchQuery(statOptions))
    );
  });
};
export default function AdminDashboardRoute() {
  return (
    <DashboardLayout title="Dashboard" description="Tổng quan hoạt động cửa hàng">
      <AdminDashboardPage />
    </DashboardLayout>
  );
}
