import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import { getBookingQuertOptions } from '@/features/booking/api/get-booking';
import BookingDetailPage from '@/features/booking/customer-app/booking-detail/page';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ params }: ClientLoaderFunctionArgs) => {
    const bookingId = params.bookingId as string;
    const queryOptions = getBookingQuertOptions(bookingId);

    return (
      queryClient.getQueryData(queryOptions.queryKey) ??
      (await queryClient.fetchQuery(queryOptions))
    );
  });
};
export default function BookingDetailsRoute() {
  return <BookingDetailPage />;
}
