import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { reportQueryKeys } from '@/features/report/api/query-keys';
import { topEmployeeResponseSchema } from '@/features/report/domain/report-http-schema';
import type { TopEmployeeQuery } from '@/features/report/domain/report-state';
import {
  mapTopEmoloyeesQueryToDto,
  mapTopEmployeesDtoToEntities,
} from '@/features/report/domain/report.transform';
import { REPORT_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getTopEmployees = (config: AxiosRequestConfig) => {
  return http.get(REPORT_ENDPOINTS.TOP_EMPLOYEES, config);
};

export const getTopEmployeesQueryOptions = (query: TopEmployeeQuery) => {
  return queryOptions({
    queryKey: reportQueryKeys.top_employee(query),
    queryFn: async ({ signal }) => {
      const queryDto = mapTopEmoloyeesQueryToDto(query);
      const config = { signal, params: queryDto };
      const raw = await getTopEmployees(config);
      const response = topEmployeeResponseSchema.parse(raw);

      return mapTopEmployeesDtoToEntities(response.data);
    },
  });
};

type UseTopEmployeesOptions = {
  query?: TopEmployeeQuery;
  queryConfig?: QueryConfig<typeof getTopEmployeesQueryOptions>;
};

export const useTopEmployees = ({ query, queryConfig }: UseTopEmployeesOptions = {}) => {
  return useQuery({
    ...getTopEmployeesQueryOptions(query || {}),
    ...queryConfig,
  });
};
