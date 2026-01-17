import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import {
  RevenueChartQuerySchema,
  type RevenueChartQuery,
} from '@/features/report/domain/report-state';

function objectToSearchParams(obj: Record<string, unknown>) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });
  return params;
}

export const useRevenueChartFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const parsed = RevenueChartQuerySchema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return RevenueChartQuerySchema.parse({});
    }

    return parsed.data;
  }, [searchParams]);

  const setFilters = useCallback(
    (next: Partial<RevenueChartQuery>) => {
      const merged = {
        ...filters,
        ...next,
      };
      setSearchParams(objectToSearchParams(merged));
    },
    [filters, setSearchParams],
  );
  return {
    filters,
    setFilters,
  };
};
