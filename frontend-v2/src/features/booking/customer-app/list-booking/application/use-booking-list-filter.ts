import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router';

import { customerBookingQuerySchema } from '@/features/booking/domain/booking.state';
import type { CustomerBookingQuery } from '@/features/booking/domain/booking.state';

function objectToSearchParams(obj: Record<string, unknown>) {
  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });

  return params;
}
export const useBookingListFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<CustomerBookingQuery>(() => {
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = customerBookingQuerySchema.safeParse(raw);

    if (!parsed.success) {
      return customerBookingQuerySchema.parse({});
    }

    return parsed.data;
  }, [searchParams]);

  const setFilters = useCallback(
    (next: Partial<CustomerBookingQuery>) => {
      const merged = {
        ...filters,
        ...next,
      };

      setSearchParams(objectToSearchParams(merged));
    },
    [filters, setSearchParams],
  );

  const updateFilter = useCallback(
    <K extends keyof CustomerBookingQuery>(key: K, value: CustomerBookingQuery[K] | undefined) => {
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
