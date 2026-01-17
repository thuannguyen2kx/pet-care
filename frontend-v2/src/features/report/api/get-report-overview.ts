import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { reportQueryKeys } from '@/features/report/api/query-keys';
import { reportOverviewResponseSchema } from '@/features/report/domain/report-http-schema';
import type { ReportOverviewQuery } from '@/features/report/domain/report-state';
import {
  mapReportOverviewDtoToEntity,
  mapReportOverviewQueryToDto,
} from '@/features/report/domain/report.transform';
import { REPORT_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getReportOverview = (config: AxiosRequestConfig) => {
  return http.get(REPORT_ENDPOINTS.OVERVIEW, config);
};

export const getReportOverviewQueryOptions = (query: ReportOverviewQuery) => {
  return queryOptions({
    queryKey: reportQueryKeys.overview(query),
    queryFn: async ({ signal }) => {
      const queryDto = mapReportOverviewQueryToDto(query);
      const config = { signal, params: queryDto };
      const raw = await getReportOverview(config);
      const response = reportOverviewResponseSchema.parse(raw);
      return mapReportOverviewDtoToEntity(response.data);
    },
  });
};

type UseReportOverviewOptions = {
  query: ReportOverviewQuery;
  queryConfig?: QueryConfig<typeof getReportOverviewQueryOptions>;
};
export const useReportOverview = ({ query, queryConfig }: UseReportOverviewOptions) => {
  return useQuery({
    ...getReportOverviewQueryOptions(query),
    ...queryConfig,
  });
};
