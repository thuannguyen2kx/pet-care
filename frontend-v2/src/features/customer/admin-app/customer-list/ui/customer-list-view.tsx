import { CustomerListContent } from '@/features/customer/admin-app/customer-list/ui/customer-list-content';
import { CustomerListPagination } from '@/features/customer/admin-app/customer-list/ui/customer-list-pagination';
import { CustomerListToolbar } from '@/features/customer/admin-app/customer-list/ui/customer-list-toolbar';
import type { CustomerListItem } from '@/features/customer/domain/customer-entity';
import type { CustomersQuery } from '@/features/customer/domain/customer-state';

type Props = {
  filters: CustomersQuery;
  setFilters: (next: Partial<CustomersQuery>) => void;
  isLoading: boolean;
  customers: CustomerListItem[];
  page: number;
  totalPages: number;
};

export function CustomerListView({
  filters,
  setFilters,
  isLoading,
  customers,
  page,
  totalPages,
}: Props) {
  return (
    <>
      <CustomerListToolbar filters={filters} setFilters={setFilters} />
      <CustomerListContent isLoading={isLoading} customers={customers} />
      <CustomerListPagination
        page={page}
        totalPages={totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
    </>
  );
}
