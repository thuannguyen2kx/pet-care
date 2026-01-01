import { queryOptions, useQuery } from '@tanstack/react-query';

import { employeeKeys } from '@/features/employee/api/query-key';
import type { TEmployeeDetail } from '@/features/employee/types';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';
import type { TApiResponseSuccess } from '@/shared/types';

const getEmployee = (
  employeeId: string,
): Promise<TApiResponseSuccess<{ user: TEmployeeDetail }>> => {
  return http.get(USER_ENDPOINTS.GET_USER(employeeId));
};

export const getEmployeeQueryOptions = (employeeId: string) => {
  return queryOptions({
    queryKey: employeeKeys.detail(employeeId),
    queryFn: () => getEmployee(employeeId),
  });
};
type UseGetEmployeeOptions = {
  employeeId: string;
  queryConfig?: QueryConfig<typeof getEmployeeQueryOptions>;
};

export const useGetEmployee = ({ employeeId, queryConfig }: UseGetEmployeeOptions) => {
  return useQuery({
    ...getEmployeeQueryOptions(employeeId),
    ...queryConfig,
  });
};
