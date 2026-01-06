import { keepPreviousData } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

import { useGetServices } from '@/features/service/api/get-services';
import type { TServiceFilterForm } from '@/features/service/components/admin-service-list/service-filter-form.type';
import { mapQueryToSearchParams } from '@/features/service/mappers/map-query-to-search-params';
import { mapSearchParamsToServiceFilter } from '@/features/service/mappers/map-search-param-to-service-filter';
import { mapServiceFilterToQuery } from '@/features/service/mappers/map-service-filter-to-query';
import { useDebounce } from '@/shared/hooks/use-debounce';

export function useServiceListController() {
  const [searchParams, setSearchParams] = useSearchParams();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialFilter = useMemo(() => mapSearchParamsToServiceFilter(searchParams), []);

  const [filter, setFilter] = useState<TServiceFilterForm>(initialFilter);

  const debouncedSearch = useDebounce(filter.search, 400);

  const debouncedFilter = useMemo(
    () => ({
      ...filter,
      search: debouncedSearch,
    }),
    [filter, debouncedSearch],
  );

  const query = useMemo(() => mapServiceFilterToQuery(debouncedFilter), [debouncedFilter]);

  useEffect(() => {
    const params = mapQueryToSearchParams(query);
    setSearchParams(params, { replace: true });
  }, [query, setSearchParams]);

  const servicesQuery = useGetServices({
    filter: query,
    queryConfig: {
      placeholderData: keepPreviousData,
    },
  });

  const handleFilterChange = (next: TServiceFilterForm) => {
    setFilter((prev) => ({
      ...prev,
      ...next,
      page: next.page ?? 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  };

  return {
    /** state */
    filter,
    query,
    services: servicesQuery.data?.data.services ?? [],
    pagination: servicesQuery.data?.data.pagination,
    isLoading: servicesQuery.isLoading,

    /** actions */
    setFilter: handleFilterChange,
    setPage: handlePageChange,
    refetch: servicesQuery.refetch,
  };
}
