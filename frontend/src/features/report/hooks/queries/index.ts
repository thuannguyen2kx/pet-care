// src/hooks/reports.queries.ts
import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  UseQueryOptions,
  UseMutationOptions 
} from '@tanstack/react-query';
import { 
  reportsApi, 
  ReportFilters, 
  ReportsResponse, 
  ReportResponse, 
  DashboardStatisticsResponse 
} from '@/features/report/api';

// Query keys
export const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (filters: ReportFilters) => [...reportKeys.lists(), filters] as const,
  details: () => [...reportKeys.all, 'detail'] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
  dashboard: () => [...reportKeys.all, 'dashboard'] as const,
};

// Get reports query hook
export function useReports(
  filters: ReportFilters = {},
  options?: UseQueryOptions<ReportsResponse>
) {
  return useQuery({
    queryKey: reportKeys.list(filters),
    queryFn: () => reportsApi.getReports(filters),
    ...options
  });
}

// Get report by ID query hook
export function useReport(
  reportId: string,
  options?: UseQueryOptions<ReportResponse>
) {
  return useQuery({
    queryKey: reportKeys.detail(reportId),
    queryFn: () => reportsApi.getReportById(reportId),
    enabled: !!reportId,
    ...options
  });
}

// Get dashboard statistics query hook
export function useDashboardStatistics(
  options?: UseQueryOptions<DashboardStatisticsResponse>
) {
  return useQuery({
    queryKey: reportKeys.dashboard(),
    queryFn: () => reportsApi.getDashboardStatistics(),
    ...options
  });
}

// Generate report mutation hooks
export function useGenerateDailyReport(
  options?: UseMutationOptions<ReportResponse, Error, Date>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reportsApi.generateDailyReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportKeys.dashboard() });
    },
    ...options
  });
}

export function useGenerateWeeklyReport(
  options?: UseMutationOptions<ReportResponse, Error, Date>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reportsApi.generateWeeklyReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportKeys.dashboard() });
    },
    ...options
  });
}

export function useGenerateMonthlyReport(
  options?: UseMutationOptions<ReportResponse, Error, Date>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reportsApi.generateMonthlyReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportKeys.dashboard() });
    },
    ...options
  });
}

export function useGenerateYearlyReport(
  options?: UseMutationOptions<ReportResponse, Error, Date>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reportsApi.generateYearlyReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reportKeys.dashboard() });
    },
    ...options
  });
}