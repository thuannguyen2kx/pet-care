import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import {
  EmployeesQuerySchema,
  type EmployeesQuery,
} from '@/features/employee/domain/employee-state';

function objectToSearchParams(obj: Record<string, unknown>) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });
  return params;
}
export const useEmployeeListFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<EmployeesQuery>(() => {
    const parsed = EmployeesQuerySchema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return EmployeesQuerySchema.parse({});
    }

    return parsed.data;
  }, [searchParams]);

  const setFilters = useCallback(
    (next: Partial<EmployeesQuery>) => {
      const megred = {
        ...filters,
        ...next,
      };
      setSearchParams(objectToSearchParams(megred));
    },
    [filters, setSearchParams],
  );

  const updateFilter = useCallback(
    <K extends keyof EmployeesQuery>(key: K, value: EmployeesQuery[K] | undefined) => {
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
};
