import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import CreatePetPage from '@/features/pets/customer-app/create-pet/page';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async (_args: ClientLoaderFunctionArgs) => {});
};
export default function CustomerPetNewRoute() {
  return <CreatePetPage />;
}
