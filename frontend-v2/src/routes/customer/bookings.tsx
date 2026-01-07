import type { QueryClient } from '@tanstack/react-query';
import type { ClientActionFunctionArgs } from 'react-router';

import { getServicesQueryOptions } from '@/features/service/api/get-services';
import CustomerServiceContainer from '@/features/service/containers/customer-services-container';

export const clientLoader = (queryClient: QueryClient) => {
  return async ({ request }: ClientActionFunctionArgs) => {
    const url = new URL(request.url);
    const filter = {
      search: url.searchParams.get('search') || undefined,
      category: url.searchParams.get('category') || undefined,
      page: Number(url.searchParams.get('page') || 1),
    };
    const query = getServicesQueryOptions(filter);

    return queryClient.getQueryData(query.queryKey) ?? queryClient.fetchQuery(query);
  };
};
export default function CustomerBookingsRoute() {
  return <CustomerServiceContainer />;
}
