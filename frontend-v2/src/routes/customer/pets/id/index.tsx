import type { QueryClient } from '@tanstack/react-query';
import { type ClientLoaderFunctionArgs } from 'react-router';

import { getPetQueryOptions } from '@/features/pets/api/get-pet';
import PetDetailPage from '@/features/pets/customer-app/pet-detail/page';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async ({ params }: ClientLoaderFunctionArgs) => {
    const petId = params.petId as string;
    const query = getPetQueryOptions(petId);
    return queryClient.getQueryData(query.queryKey) ?? queryClient.fetchQuery(query);
  });
};

export default function CustomerPetDetailsPage() {
  return <PetDetailPage />;
}
