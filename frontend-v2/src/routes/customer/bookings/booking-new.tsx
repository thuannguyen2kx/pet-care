import type { QueryClient } from '@tanstack/react-query';
import { redirect, type ClientLoaderFunctionArgs } from 'react-router';

import CreateBookingPage from '@/features/booking/customer-app/create-booking/page';
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

    await Promise.all([queryClient.ensureQueryData(query)]);

    return { serviceId };
  });
};
export default function NewBookingRoute() {
  return <CreateBookingPage />;
}
