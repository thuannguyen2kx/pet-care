import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { reportQueryKeys } from '@/features/report/api/query-keys';
import { reportCustomerResponseSchema } from '@/features/report/domain/report-http-schema';
import type { ReportCustomersQuery } from '@/features/report/domain/report-state';
import {
  mapCustomerReportResponseDtoToEnity,
  mapReportCustomerQueryToDto,
} from '@/features/report/domain/report.transform';
import { REPORT_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getReportCustomers = (config: AxiosRequestConfig) => {
  return http.get(REPORT_ENDPOINTS.CUSTOMERS, config);
};

export const getReportCustomersQueryOptions = (query: ReportCustomersQuery) => {
  return queryOptions({
    queryKey: reportQueryKeys.customer(query),
    queryFn: async ({ signal }) => {
      const queryDto = mapReportCustomerQueryToDto(query);
      const config = { signal, params: queryDto };
      const raw = await getReportCustomers(config);
      const reponse = reportCustomerResponseSchema.parse(raw);

      return mapCustomerReportResponseDtoToEnity(reponse);
    },
  });
};

type UseReportCustomersOptions = {
  query: ReportCustomersQuery;
  queryConfig?: QueryConfig<typeof getReportCustomersQueryOptions>;
};

export const useReportCustomers = ({ query, queryConfig }: UseReportCustomersOptions) => {
  return useQuery({
    ...getReportCustomersQueryOptions(query),
    ...queryConfig,
  });
};
