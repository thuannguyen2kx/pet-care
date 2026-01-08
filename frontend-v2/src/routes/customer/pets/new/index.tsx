import type { QueryClient } from '@tanstack/react-query';
import type { ClientLoaderFunctionArgs } from 'react-router';

import { CustomerPetNewPrecenter } from '@/features/pets/presenters/customer-pet-new.precenter';
import { BackLink } from '@/shared/components/template/back-link';
import { paths } from '@/shared/config/paths';
import { privateClientLoader } from '@/shared/lib/auth.loader';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async (_args: ClientLoaderFunctionArgs) => {});
};
export default function CustomerPetNewRoute() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-6">
      <BackLink to={paths.customer.pets.path} label="Quay lại danh sách" />
      <CustomerPetNewPrecenter />
    </main>
  );
}
