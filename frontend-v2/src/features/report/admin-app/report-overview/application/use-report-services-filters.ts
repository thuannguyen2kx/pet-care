import { useCallback, useState } from 'react';

import {
  ReportServicesQuerySchema,
  type ReportServicesQuery,
} from '@/features/report/domain/report-state';

export const useReportServicesFilters = () => {
  const [filters, setFilters] = useState<ReportServicesQuery>(() =>
    ReportServicesQuerySchema.parse({}),
  );

  const updateFilters = useCallback((next: Partial<ReportServicesQuery>) => {
    setFilters((prev) => ReportServicesQuerySchema.parse({ ...prev, ...next }));
  }, []);

  return {
    filters,
    updateFilters,
  };
};
