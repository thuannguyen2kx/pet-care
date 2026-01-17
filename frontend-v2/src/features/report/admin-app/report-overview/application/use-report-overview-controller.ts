import { useMemo } from 'react';

import { useReportOverviewFilter } from '@/features/report/admin-app/report-overview/application/use-overview-filter';
import { useReportOverview } from '@/features/report/api/get-report-overview';

export const useReportOverviewController = () => {
  const { filters, setFilters } = useReportOverviewFilter();
  const query = useReportOverview({ query: filters });

  const viewData = useMemo(() => {
    if (!query.data) return null;

    const { totalRevenue, totalBookings, completionRate, averageRating, changes } = query.data;

    return {
      revenue: {
        value: totalRevenue,
        change: changes.revenue,
      },
      bookings: {
        value: totalBookings,
        change: changes.bookings,
      },
      completionRate: {
        value: completionRate,
        change: changes.completionRate,
      },
      rating: {
        value: averageRating,
        change: changes.averageRating,
      },
    };
  }, [query.data]);

  return {
    filters,
    setFilters,
    data: viewData,
    isLoading: query.isLoading,
  };
};
