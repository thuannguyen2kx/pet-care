import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import { EmployeeWeekScheduleResponse } from '@/features/employee-schedule/domain/schedule-http-schema';
import { mapEmployeeWeekSchedulesDtoToEntities } from '@/features/employee-schedule/domain/schedule.transform';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getTeamSchedule = (config: AxiosRequestConfig) => {
  return http.get(EMPLOYEE_SCHEDULE_ENDPOINTS.TEAM_SCHEDULE, config);
};

export const getTeamScheduleQueryOptions = (startDate?: string, endDate?: string) => {
  return queryOptions({
    queryKey: employeeScheduleKeys.teamSchedule(startDate, endDate),
    queryFn: async ({ signal }) => {
      const config = { signal, params: { startDate, endDate } };
      const raw = await getTeamSchedule(config);
      const response = EmployeeWeekScheduleResponse.parse(raw);

      return mapEmployeeWeekSchedulesDtoToEntities(response.data.employees);
    },
  });
};

type UseGetTeamScheduleQueryOptions = {
  startDate?: string;
  endDate?: string;
  queryConfig?: QueryConfig<typeof getTeamScheduleQueryOptions>;
};

export const useTeamSchedule = ({
  startDate,
  endDate,
  queryConfig,
}: UseGetTeamScheduleQueryOptions = {}) => {
  return useQuery({
    ...getTeamScheduleQueryOptions(startDate, endDate),
    ...queryConfig,
  });
};
