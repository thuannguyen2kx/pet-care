import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import { getEmployeesOptions } from '@/features/employee/api/get-employees';
import AdminEmploContainerListContainer from '@/features/employee/containers/admin-employees-list.container';
import { getEmployeeListFilterSchema } from '@/features/employee/shemas';
import DashboardLayout from '@/routes/admin/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

// eslint-disable-next-line react-refresh/only-export-components
export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url);
    const {
      specialty,
      isAcceptingBookings,
      page = 1,
      limit,
    } = getEmployeeListFilterSchema.parse(Object.fromEntries(url.searchParams));

    const query = getEmployeesOptions({
      specialty,
      isAcceptingBookings,
      page: Number(page),
      limit: Number(limit),
    });

    return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
  });
};

export default function AdminEmployeesRoute() {
  return (
    <DashboardLayout
      title="Quản lý nhân viên"
      description="Tạo và quản lý thông tin nhân viên cửa hàng"
    >
      <AdminEmploContainerListContainer />
    </DashboardLayout>
  );
}
