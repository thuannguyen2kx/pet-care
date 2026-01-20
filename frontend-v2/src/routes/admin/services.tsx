import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import AdminServiceList from '@/features/service/admin-app/service-list/page';
import { getServicesQueryOptions } from '@/features/service/api/get-services';
import { ServicesQuerySchema } from '@/features/service/domain/serivice.state';
import DashboardLayout from '@/routes/admin/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url);
    const parsed = ServicesQuerySchema.safeParse(Object.fromEntries(url.searchParams));

    if (!parsed.success) {
      throw new Response('Invalid query params', { status: 400 });
    }
    const queryParams = parsed.data;
    const query = getServicesQueryOptions(queryParams);

    return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
  });
};
export default function AdminServicesRoute() {
  return (
    <DashboardLayout title="Quản lý dịch vụ" description="Tạo và quản lý các dịch vụ của cửa hàng">
      <AdminServiceList />
    </DashboardLayout>
  );
}
