import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import EmployeeListPage from '@/features/employee/admin-app/employee-list/page';
import { getEmployeesOptions } from '@/features/employee/api/get-employees';
import { EmployeesQuerySchema } from '@/features/employee/domain/employee-state';
import DashboardLayout from '@/routes/admin/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

// eslint-disable-next-line react-refresh/only-export-components
export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url);
    const parsed = EmployeesQuerySchema.safeParse(Object.fromEntries(url.searchParams));

    if (!parsed.success) {
      throw new Response('Invalid query params', { status: 400 });
    }
    const queryParams = parsed.data;
    const query = getEmployeesOptions(queryParams);

    return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
  });
};

export default function AdminEmployeesRoute() {
  return (
    <DashboardLayout
      title="Quản lý nhân viên"
      description="Tạo và quản lý thông tin nhân viên cửa hàng"
    >
      <EmployeeListPage />
    </DashboardLayout>
  );
}
