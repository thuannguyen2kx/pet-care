import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import { getBookingsQueryOptions } from '@/features/booking/api/get-bookings';
import BookingListPage from '@/features/booking/customer-app/list-booking/page';
import { customerBookingQuerySchema } from '@/features/booking/domain/booking.state';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url);
    const parsed = customerBookingQuerySchema.safeParse(Object.fromEntries(url.searchParams));

    if (!parsed.success) {
      console.log('error');
      throw new Response('Invalid query params', { status: 400 });
    }

    const queryPrams = parsed.data;
    const queryOptions = getBookingsQueryOptions(queryPrams);

    return (
      queryClient.getQueryData(queryOptions.queryKey) ??
      (await queryClient.fetchQuery(queryOptions))
    );
  });
};
export default function MyListBookingRoute() {
  return <BookingListPage />;
}
