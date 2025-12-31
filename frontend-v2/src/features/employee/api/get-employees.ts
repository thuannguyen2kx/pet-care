import { queryOptions, useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { employeeKeys } from '@/features/employee/api/query-key';
import type { TEmployeeFilter } from '@/features/employee/shemas';
import type { TGetEmployeeListResponse } from '@/features/employee/types';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';
import type { TApiResponseSuccess } from '@/shared/types/api-response';

const getEmployees = (
  filter: TEmployeeFilter,
): Promise<TApiResponseSuccess<TGetEmployeeListResponse>> => {
  return http.get(USER_ENDPOINTS.EMPLOYEE_LIST, {
    params: filter,
  });
};

export const getEmployeesOptions = (filter: TEmployeeFilter) => {
  return queryOptions({
    queryKey: employeeKeys.list(filter),
    queryFn: () => getEmployees(filter),
  });
};

type UseGetEmployeesOptions = {
  filter: TEmployeeFilter;
  queryConfig?: QueryConfig<typeof getEmployeesOptions>;
};

export const useEmployees = ({ filter, queryConfig }: UseGetEmployeesOptions) => {
  return useQuery({
    ...getEmployeesOptions(filter),
    ...queryConfig,
  });
};
