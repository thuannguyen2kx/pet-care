import { useCustomerListFilter } from '@/features/customer/admin-app/customer-list/application/use-customer-list-filter';
import { useCustomers } from '@/features/customer/api/get-customers';

export const useCustomerListController = () => {
  const { filters, setFilters } = useCustomerListFilter();
  const customersQuery = useCustomers({
    query: filters,
  });

  return {
    data: customersQuery.data?.customers || [],
    pagination: customersQuery.data?.pagination,
    isLoading: customersQuery.isLoading,
    filter: filters,
    setFilter: setFilters,
  };
};
