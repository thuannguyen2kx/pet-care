import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import { getServicesQueryOptions } from '@/features/service/api/get-services';
import AdminServicesContainer from '@/features/service/containers/admin-services-container';
import { mapSearchParamsToServiceQuery } from '@/features/service/mappers/map-search-param-to-service-query';
import DashboardLayout from '@/routes/admin/layout';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url);
    const filter = mapSearchParamsToServiceQuery(url.searchParams);
    const query = getServicesQueryOptions(filter);

    return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
  });
};
export default function AdminServicesRoute() {
  return (
    <DashboardLayout title="Quản lý dịch vụ" description="Tạo và quản lý các dịch vụ của cửa hàng">
      <AdminServicesContainer />
    </DashboardLayout>
  );
}
