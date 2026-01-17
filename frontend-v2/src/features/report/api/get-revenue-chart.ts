import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { reportQueryKeys } from '@/features/report/api/query-keys';
import { revenueChartResponseDtoSchema } from '@/features/report/domain/report-http-schema';
import type { RevenueChartQuery } from '@/features/report/domain/report-state';
import {
  mapRevenueChartDtoToEntity,
  mapRevenueChartQueryToDto,
} from '@/features/report/domain/report.transform';
import { REPORT_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getRevenueChart = (config: AxiosRequestConfig) => {
  return http.get(REPORT_ENDPOINTS.REVENUE_CHART, config);
};

export const getRevenueChartQueryOptions = (query: RevenueChartQuery) => {
  return queryOptions({
    queryKey: reportQueryKeys.revenue_chart(query),
    queryFn: async ({ signal }) => {
      const queryDto = mapRevenueChartQueryToDto(query);
      const config = { signal, params: queryDto };
      const raw = await getRevenueChart(config);
      const parsed = revenueChartResponseDtoSchema.parse(raw);
      return mapRevenueChartDtoToEntity(parsed);
    },
  });
};

type UseRevenueChartOptions = {
  query: RevenueChartQuery;
  queryConfig?: QueryConfig<typeof getRevenueChartQueryOptions>;
};
export const useRevenueChart = ({ query, queryConfig }: UseRevenueChartOptions) => {
  return useQuery({
    ...getRevenueChartQueryOptions(query),
    ...queryConfig,
  });
};
