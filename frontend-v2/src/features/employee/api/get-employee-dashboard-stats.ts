import { queryOptions, useQuery } from '@tanstack/react-query';

import { employeeKeys } from '@/features/employee/api/query-key';
import { employeeDashboardStatsResponseSchema } from '@/features/employee/domain/employee-http-schema';
import { mapEmployeeDashboardStatDtoToEntity } from '@/features/employee/domain/employee.transform';
import { EMPLOYEE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getEmployeeDashboardStats = () => {
  return http.get(EMPLOYEE_ENDPOINTS.DASHBOARD_STATS);
};

export const getEmployeeDashboardStatsQueryOptions = () => {
  return queryOptions({
    queryKey: employeeKeys.dashboard_stats(),
    queryFn: async () => {
      const raw = await getEmployeeDashboardStats();
      const response = employeeDashboardStatsResponseSchema.parse(raw);
      return mapEmployeeDashboardStatDtoToEntity(response.data);
    },
  });
};

type UseEmployeeDashboardStatsOptions = {
  queryConfig?: QueryConfig<typeof getEmployeeDashboardStats>;
};

export const useEmployeeDashboardStats = ({
  queryConfig,
}: UseEmployeeDashboardStatsOptions = {}) => {
  return useQuery({
    ...getEmployeeDashboardStatsQueryOptions(),
    ...queryConfig,
  });
};
