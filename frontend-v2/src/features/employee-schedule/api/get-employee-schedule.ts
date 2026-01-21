import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import { EmployeWorkScheduleResponseSchema } from '@/features/employee-schedule/domain/schedule-http-schema';
import type { EmployeeScheduleQuery } from '@/features/employee-schedule/domain/schedule.state';
import { mapEmployeeSchedulesDtoToEntities } from '@/features/employee-schedule/domain/schedule.transform';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getEmployeeSchedule = (config: AxiosRequestConfig) => {
  return http.get(EMPLOYEE_SCHEDULE_ENDPOINTS.SCHEDULE, config);
};

export const getEmployeeScheduleQueryOptions = ({
  employeeId,
  startDate,
  endDate,
}: EmployeeScheduleQuery) => {
  return queryOptions({
    queryKey: employeeScheduleKeys.detail(employeeId, startDate, endDate),
    queryFn: async ({ signal }) => {
      const config = { signal, params: { employeeId, startDate, endDate } };
      const raw = await getEmployeeSchedule(config);
      const response = EmployeWorkScheduleResponseSchema.parse(raw);
      return mapEmployeeSchedulesDtoToEntities(response.data);
    },
  });
};

type UseGetEmployeeScheduleOptions = {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  queryConfig?: QueryConfig<typeof getEmployeeSchedule>;
};

export const useEmployeeSchedule = ({
  employeeId,
  startDate,
  endDate,
  queryConfig,
}: UseGetEmployeeScheduleOptions = {}) => {
  return useQuery({
    ...getEmployeeScheduleQueryOptions({ employeeId, startDate, endDate }),
    ...queryConfig,
  });
};
