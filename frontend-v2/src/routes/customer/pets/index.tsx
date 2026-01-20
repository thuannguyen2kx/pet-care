import type { QueryClient } from '@tanstack/react-query';
import { type ClientLoaderFunctionArgs } from 'react-router';

import { getUserPetsQueryOptions } from '@/features/pets/api/get-user-pet';
import MyPetsPage from '@/features/pets/customer-app/my-pets/page';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async (_args: ClientLoaderFunctionArgs) => {
    const query = getUserPetsQueryOptions();
    return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
  });
};

export default function CustomerPetsRoute() {
  return <MyPetsPage />;
}
