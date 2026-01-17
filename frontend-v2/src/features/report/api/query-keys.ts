import type {
  ReportOverviewQuery,
  ReportServicesQuery,
  RevenueChartQuery,
  TopEmployeeQuery,
} from '@/features/report/domain/report-state';

export const reportQueryKeys = {
  all: ['report'],
  dashboard: ['report', 'dashboard'],
  top_employees: ['report', 'top-employees'],
  top_employee: (params?: TopEmployeeQuery) => [...reportQueryKeys.top_employees, params],
  overviews: ['report', 'overviews'],
  overview: (params?: ReportOverviewQuery) => [...reportQueryKeys.overviews, params],
  revenue_charts: ['report', 'revenue-charts'],
  revenue_chart: (params?: RevenueChartQuery) => [...reportQueryKeys.revenue_charts, params],
  services: ['report', 'services'],
  service: (params: ReportServicesQuery) => [...reportQueryKeys.services, params],
};
