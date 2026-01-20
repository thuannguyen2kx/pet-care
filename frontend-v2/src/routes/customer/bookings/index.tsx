import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router';

import { getServicesQueryOptions } from '@/features/service/api/get-services';
import ServiceListPage from '@/features/service/customer-app/service-list/page';
import { ServicesQuerySchema } from '@/features/service/domain/serivice.state';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const parsed = ServicesQuerySchema.safeParse(Object.fromEntries(url.searchParams));

    if (!parsed.success) {
      throw new Response('Invalid query params', { status: 400 });
    }
    const queryParams = parsed.data;
    const query = getServicesQueryOptions(queryParams);

    return queryClient.getQueryData(query.queryKey) ?? queryClient.fetchQuery(query);
  });
};
export default function CustomerBookingsRoute() {
  return <ServiceListPage />;
}
