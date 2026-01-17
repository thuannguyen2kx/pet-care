import { useRevenueChartFilter } from '@/features/report/admin-app/report-overview/application/use-revenue-chart-filter';
import { useRevenueChart } from '@/features/report/api/get-revenue-chart';

export const useRevenueChartController = () => {
  const { filters } = useRevenueChartFilter();

  const query = useRevenueChart({
    query: filters,
  });

  const points = query.data?.points ?? [];

  const dailyRevenue = points
    .slice(-7)
    .reverse()
    .map((item, index, arr) => {
      const prev = arr[index + 1];
      const change = prev ? ((item.revenue - prev.revenue) / prev.revenue) * 100 : undefined;

      return {
        label: item.label,
        revenue: item.revenue,
        change,
      };
    });

  return {
    points: points,
    summary: query.data?.summary,
    isLoading: query.isLoading,
    dailyRevenue,
  };
};
