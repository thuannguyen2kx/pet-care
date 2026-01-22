import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { employeeQueryKeys } from '@/features/employee/api/query-keys';
import { EmployeeListResponseSchema } from '@/features/employee/domain/employee-http-schema';
import type { EmployeesQuery } from '@/features/employee/domain/employee-state';
import {
  mapEmployeeListItemsToEntities,
  mapEmployeesQueryToDto,
} from '@/features/employee/domain/employee.transform';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getEmployees = (config: AxiosRequestConfig) => {
  return http.get(USER_ENDPOINTS.EMPLOYEE_LIST, config);
};

export const getEmployeesOptions = (query: EmployeesQuery) => {
  return queryOptions({
    queryKey: employeeQueryKeys.admin.list(query),
    queryFn: async ({ signal }) => {
      const queryDto = mapEmployeesQueryToDto(query);
      const config = { signal, params: queryDto };
      const raw = await getEmployees(config);
      const response = EmployeeListResponseSchema.parse(raw);
      return {
        employees: mapEmployeeListItemsToEntities(response.data.employees),
        pages: response.data.pages,
        total: response.data.total,
      };
    },
  });
};

type UseGetEmployeesOptions = {
  query: EmployeesQuery;
  queryConfig?: QueryConfig<typeof getEmployeesOptions>;
};

export const useEmployees = ({ query, queryConfig }: UseGetEmployeesOptions) => {
  return useQuery({
    ...getEmployeesOptions(query),
    ...queryConfig,
  });
};
