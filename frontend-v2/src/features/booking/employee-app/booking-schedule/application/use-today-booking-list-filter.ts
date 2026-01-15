import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import {
  employeeBookingQuerySchema,
  type EmployeeBookingQuery,
} from '@/features/booking/domain/booking.state';

function objectToSearchParams(obj: Record<string, unknown>) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });
  return params;
}
export const useEmployeeBookingListFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const parsed = employeeBookingQuerySchema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return employeeBookingQuerySchema.parse({});
    }

    return parsed.data;
  }, [searchParams]);

  const setFilters = useCallback(
    (next: Partial<EmployeeBookingQuery>) => {
      const merged = {
        ...filters,
        ...next,
      };
      setSearchParams(objectToSearchParams(merged));
    },
    [filters, setSearchParams],
  );

  const updateFilter = useCallback(
    <K extends keyof EmployeeBookingQuery>(key: K, value: EmployeeBookingQuery[K] | undefined) => {
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
