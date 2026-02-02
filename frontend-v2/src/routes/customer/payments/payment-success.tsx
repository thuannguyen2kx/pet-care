import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import PaymentSuccessPage from '@/features/payments/customer-app/payment-success/page';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async (_args: ClientLoaderFunctionArgs) => {});
};
export default function PaymentSuccessRoute() {
  return <PaymentSuccessPage />;
}
