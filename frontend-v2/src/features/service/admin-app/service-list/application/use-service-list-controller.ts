import { useAdminServiceListFilter } from '@/features/service/admin-app/service-list/application/use-service-list-filter';
import { useGetAdminServices } from '@/features/service/api/get-services';

export const useAdminServiceListController = () => {
  const { filters, setFilters } = useAdminServiceListFilter();

  const servicesQuery = useGetAdminServices({
    filter: filters,
  });

  return {
    data: servicesQuery.data?.services || [],
    pagination: servicesQuery.data?.pagination,
    isLoading: servicesQuery.isLoading,
    filter: filters,
    setFilters,
  };
};
