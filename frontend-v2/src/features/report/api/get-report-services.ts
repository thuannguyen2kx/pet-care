import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { reportQueryKeys } from '@/features/report/api/query-keys';
import { reportServicesResponseSchema } from '@/features/report/domain/report-http-schema';
import type { ReportServicesQuery } from '@/features/report/domain/report-state';
import {
  mapReportServiceQueryToDto,
  mapReportServicesDtoToEntities,
} from '@/features/report/domain/report.transform';
import { REPORT_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getReportServices = (config: AxiosRequestConfig) => {
  return http.get(REPORT_ENDPOINTS.SERVICES, config);
};

export const getReportServicesQueryOptions = (query: ReportServicesQuery) => {
  return queryOptions({
    queryKey: reportQueryKeys.service(query),
    queryFn: async ({ signal }) => {
      const queryDto = mapReportServiceQueryToDto(query);
      const config = { signal, params: queryDto };
      const raw = await getReportServices(config);
      const parsed = reportServicesResponseSchema.parse(raw);

      return {
        range: parsed.range,
        services: mapReportServicesDtoToEntities(parsed.data),
      };
    },
  });
};

type UseReportServicesOptions = {
  query: ReportServicesQuery;
  queryConfig?: QueryConfig<typeof getReportServicesQueryOptions>;
};
export const useReportServices = ({ query, queryConfig }: UseReportServicesOptions) => {
  return useQuery({
    ...getReportServicesQueryOptions(query),
    ...queryConfig,
  });
};
