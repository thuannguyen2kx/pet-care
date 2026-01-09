import type { QueryClient } from '@tanstack/react-query';
import { redirect, type ClientLoaderFunctionArgs } from 'react-router';

import CreateBookingContainer from '@/features/containers/create-booking-container';
import { getSerivceQueryOptions } from '@/features/service/api/get-service';
import { paths } from '@/shared/config/paths';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url);
    const serviceId = url.searchParams.get('serviceId');

    if (!serviceId) {
      throw redirect(paths.customer.booking.path);
    }

    const query = getSerivceQueryOptions(serviceId);

    const serviceQuery =
      queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));

    return { serviceId, service: serviceQuery.data.service };
  });
};
export default function NewBookingRoute() {
  return <CreateBookingContainer />;
}
