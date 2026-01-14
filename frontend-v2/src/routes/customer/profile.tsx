import type { QueryClient } from '@tanstack/react-query';

import { getCustomerProfileQueryOptions } from '@/features/customer/api/get-profile';
import CustomerProfilePage from '@/features/customer/customer-app/profile/page';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async () => {
    const profileOptions = getCustomerProfileQueryOptions();

    return (
      queryClient.getQueryData(profileOptions.queryKey) ??
      (await queryClient.fetchQuery(profileOptions))
    );
  });
};
export default function CustomerProfileRoute() {
  return <CustomerProfilePage />;
}
