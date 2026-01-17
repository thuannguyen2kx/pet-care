import { useReportServicesFilters } from '@/features/report/admin-app/report-overview/application/use-report-services-filters';
import { useReportServices } from '@/features/report/api/get-report-services';

export const useReportServicesByBookingCount = () => {
  const { filters, updateFilters } = useReportServicesFilters();

  const query = {
    ...filters,
    sortBy: 'bookingCount' as const,
  };

  const reportServicesQuery = useReportServices({ query });

  return {
    filters,
    data: reportServicesQuery.data,
    isLoading: reportServicesQuery.isLoading,
    updateFilters,
  };
};
