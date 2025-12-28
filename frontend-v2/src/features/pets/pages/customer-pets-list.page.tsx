import type { QueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Link } from 'react-router';

import { getUserPetsQueryOptions } from '@/features/pets/api/get-user-pet';
import { CustomerPetsListPrecenter } from '@/features/pets/presenters/cutomer-pets-list.precenter';
import { BackLink } from '@/shared/components/template/back-link';
import { paths } from '@/shared/config/paths';
import { Button } from '@/shared/ui/button';

export const clientLoader = (queryClient: QueryClient) => {
  return async () => {
    const query = getUserPetsQueryOptions();

    return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query));
  };
};

export default function CustomerPetsListPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <BackLink to={paths.customer.dashboard.path} label="Quay lại trang chủ" />

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
