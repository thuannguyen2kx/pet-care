import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import {
  adminBookingQuerySchema,
  type AdminBookingQuery,
} from '@/features/booking/domain/booking.state';

function objectToSearchParams(obj: Record<string, unknown>) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });
  return params;
}
export function useAdminBookingListFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<AdminBookingQuery>(() => {
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = adminBookingQuerySchema.safeParse(raw);
    if (!parsed.success) {
      return adminBookingQuerySchema.parse({});
    }
    return parsed.data;
  }, [searchParams]);

  const setFilters = useCallback(
    (next: Partial<AdminBookingQuery>) => {
      const merged = {
        ...filters,
        ...next,
      };
      setSearchParams(objectToSearchParams(merged));
    },
    [filters, setSearchParams],
  );

  const updateFilter = useCallback(
    <K extends keyof AdminBookingQuery>(key: K, value: AdminBookingQuery[K] | undefined) => {
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
