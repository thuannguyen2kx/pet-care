import { queryOptions, useQuery } from '@tanstack/react-query';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getEmployeeDetail = (employeeId: string) => {
  return http.get(EMPLOYEE_SCHEDULE_ENDPOINTS.GET_EMPLOYEE(employeeId));
};

export const getEmployeeDetailQueryOptions = (employeeId: string) => {
  return queryOptions({
    queryKey: employeeScheduleKeys.employeeDetail(employeeId),
    queryFn: () => getEmployeeDetail(employeeId),
  });
};

type UseGetEmployeeDetailOptions = {
  employeeId: string;
  queryConfig?: QueryConfig<typeof getEmployeeDetailQueryOptions>;
};

export const useEmployeeDetail = ({ employeeId, queryConfig }: UseGetEmployeeDetailOptions) => {
  return useQuery({
    ...getEmployeeDetailQueryOptions(employeeId),
    ...queryConfig,
  });
};
