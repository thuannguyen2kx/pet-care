import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { reportQueryKeys } from '@/features/report/api/query-keys';
import { adminDashboardStatResponseSchema } from '@/features/report/domain/report-http-schema';
import { mapAdminDashboardStatDtoToEntity } from '@/features/report/domain/report.transform';
import { REPORT_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getAdminDashboardStat = (config: AxiosRequestConfig) => {
  return http.get(REPORT_ENDPOINTS.DASHBOARD, config);
};

export const getAdminDashboardStatQueryOptions = () => {
  return queryOptions({
    queryKey: reportQueryKeys.dashboard,
    queryFn: async ({ signal }) => {
      const config = { signal };
      const raw = await getAdminDashboardStat(config);
      const response = adminDashboardStatResponseSchema.parse(raw);
      return mapAdminDashboardStatDtoToEntity(response.data);
    },
  });
};

type UseAdminDashboardStatOptions = {
  queryConfig?: QueryConfig<typeof getAdminDashboardStatQueryOptions>;
};

export const useAdminDashboardStat = ({ queryConfig }: UseAdminDashboardStatOptions = {}) => {
  return useQuery({
    ...getAdminDashboardStatQueryOptions(),
    ...queryConfig,
  });
};
