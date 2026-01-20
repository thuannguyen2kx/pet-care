import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import { ServicesQuerySchema, type ServicesQuery } from '@/features/service/domain/serivice.state';

function objectToSearchParams(obj: Record<string, unknown>) {
  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });

  return params;
}
export const useAdminServiceListFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<ServicesQuery>(() => {
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = ServicesQuerySchema.safeParse(raw);

    if (!parsed.success) {
      return ServicesQuerySchema.parse({});
    }

    return parsed.data;
  }, [searchParams]);

  const setFilters = useCallback(
    (next: Partial<ServicesQuery>) => {
      const merged = {
        ...filters,
        ...next,
      };

      setSearchParams(objectToSearchParams(merged));
    },
    [filters, setSearchParams],
  );

  const updateFilter = useCallback(
    <K extends keyof ServicesQuery>(key: K, value: ServicesQuery[K] | undefined) => {
      const next = new URLSearchParams(searchParams);

      if (value !== undefined && value !== null) {
        next.set(key, String(value));
      }

      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
  };
};
