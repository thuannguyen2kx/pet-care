import { useGetServices } from '@/features/service/api/get-services';
import { useServiceListFilter } from '@/features/service/customer-app/service-list/application/use-service-list-controller';

export const useServiceListController = () => {
  const { filters, setFilters } = useServiceListFilter();

  const servicesQuery = useGetServices({
    filter: filters,
  });

  return {
    data: servicesQuery.data?.services || [],
    pagination: servicesQuery.data?.pagination,
    isLoading: servicesQuery.isLoading,
    filter: filters,
    setFilter: setFilters,
  };
};
