import { queryOptions, useQuery } from '@tanstack/react-query';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import type { TEmployeeScheduleDay } from '@/features/employee-schedule/domain/schedule.type';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';
import type { TApiResponseSuccess } from '@/shared/types';

type GetEmployeeScheduleParams = {
  employeeId: string;
  startDate?: string; // ISO
  endDate?: string; // ISO
};
const getEmployeeSchedule = (
  params: GetEmployeeScheduleParams,
): Promise<TApiResponseSuccess<TEmployeeScheduleDay[]>> => {
  const { employeeId, startDate, endDate } = params;
  return http.get(EMPLOYEE_SCHEDULE_ENDPOINTS.SCHEDULE(employeeId), {
    params: { startDate, endDate },
  });
};

export const getEmployeeScheduleQueryOptions = ({
  employeeId,
  startDate,
  endDate,
}: GetEmployeeScheduleParams) => {
  return queryOptions({
    queryKey: employeeScheduleKeys.detail(employeeId, startDate, endDate),
    queryFn: () => getEmployeeSchedule({ employeeId }),
  });
};

type UseGetEmployeeScheduleOptions = {
  employeeId: string;
  startDate?: string;
  endDate?: string;
  queryConfig?: QueryConfig<typeof getEmployeeSchedule>;
};

export const useEmployeeSchedule = ({
  employeeId,
  startDate,
  endDate,
  queryConfig,
}: UseGetEmployeeScheduleOptions) => {
  return useQuery({
    ...getEmployeeScheduleQueryOptions({ employeeId, startDate, endDate }),
    ...queryConfig,
  });
};
