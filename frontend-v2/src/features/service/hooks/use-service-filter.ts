import { useSearchParams } from 'react-router';

import type { TServiceFilterForm } from '@/features/service/components/admin-service-list/service-filter-form.type';
import { mapQueryToSearchParams } from '@/features/service/mappers/map-query-to-search-params';
import { mapServiceFilterToQuery } from '@/features/service/mappers/map-service-filter-to-query';

export function useServiceFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const setFilters = (filter: TServiceFilterForm) => {
    const query = mapServiceFilterToQuery(filter);
    const params = mapQueryToSearchParams(query);
    setSearchParams(params, { replace: true });
  };

  return { searchParams, setFilters };
}
