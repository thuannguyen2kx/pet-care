import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

import {
  ReportOverviewQuerySchema,
  type ReportOverviewQuery,
} from '@/features/report/domain/report-state';

function objectToSearchParams(obj: Record<string, unknown>) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });
  return params;
}

export const useReportOverviewFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const parsed = ReportOverviewQuerySchema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return ReportOverviewQuerySchema.parse({});
    }

    return parsed.data;
  }, [searchParams]);

  const setFilters = useCallback(
    (next: Partial<ReportOverviewQuery>) => {
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
