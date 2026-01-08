import type { QueryClient } from '@tanstack/react-query';
import { ChevronLeft, Plus } from 'lucide-react';
import { Link, type ClientLoaderFunctionArgs } from 'react-router';

import { getUserPetsQueryOptions } from '@/features/pets/api/get-user-pet';
import { CustomerPetsListPrecenter } from '@/features/pets/presenters/cutomer-pets-list.precenter';
import { paths } from '@/shared/config/paths';
import { privateClientLoader } from '@/shared/lib/auth.loader';
import { Button } from '@/shared/ui/button';

export const clientLoader = (queryClient: QueryClient) => {
  return privateClientLoader(queryClient, async (_args: ClientLoaderFunctionArgs) => {
    const query = getUserPetsQueryOptions();
    return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
  });
};

export default function CustomerPetsRoute() {
  return (
    <main className="container mx-auto px-4 py-6">
      <Link
        to={paths.customer.root.path}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Quay lại trang chủ
      </Link>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="h5-bold text-foreground">Thú cưng của tôi</h1>
          <p className="text-muted-foreground">Quản lý thông tin và hồ sơ thú cưng</p>
        </div>
        <Button asChild className="gap-2">
          <Link to={paths.customer.petNew.path}>
            <Plus className="h-4 w-4" />
            Thêm thú cưng
          </Link>
        </Button>
      </div>

      <CustomerPetsListPrecenter />
    </main>
  );
}
