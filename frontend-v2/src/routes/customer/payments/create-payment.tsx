import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import { getBookingQuertOptions } from '@/features/booking/api/get-booking';
import PaymentPage from '@/features/payments/customer-app/create-payment/page';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ params }: ClientLoaderFunctionArgs) => {
    const bookingId = params.bookingId as string;
    const bookingOptions = getBookingQuertOptions(bookingId);

    await Promise.all([queryClient.ensureQueryData(bookingOptions)]);
    return bookingId;
  });
};
export default function CreatePaymentRoute() {
  return <PaymentPage />;
}
