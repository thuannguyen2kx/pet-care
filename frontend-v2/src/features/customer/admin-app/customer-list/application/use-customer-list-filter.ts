import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import {
  CustomersQuerySchema,
  type CustomersQuery,
} from '@/features/customer/domain/customer-state';

function objectToSearchParams(obj: Record<string, unknown>) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });
  return params;
}
export function useCustomerListFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<CustomersQuery>(() => {
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = CustomersQuerySchema.safeParse(raw);
    if (!parsed.success) {
      return CustomersQuerySchema.parse({});
    }
    return parsed.data;
  }, [searchParams]);

  const setFilters = useCallback(
    (next: Partial<CustomersQuery>) => {
      const merged = {
        ...filters,
        ...next,
      };
      setSearchParams(objectToSearchParams(merged));
    },
    [filters, setSearchParams],
  );

  const updateFilter = useCallback(
    <K extends keyof CustomersQuery>(key: K, value: CustomersQuery[K] | undefined) => {
      const next = new URLSearchParams(searchParams);
      if (value === undefined) {
        next.delete(key);
      } else {
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
}
