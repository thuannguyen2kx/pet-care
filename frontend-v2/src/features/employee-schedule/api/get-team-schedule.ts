import { queryOptions, useQuery } from '@tanstack/react-query';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import type { TTeamWeekScheduleResponse } from '@/features/employee-schedule/domain/schedule.type';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';
import type { TApiResponseSuccess } from '@/shared/types';

const getTeamSchedule = (
  startDate?: string,
  endDate?: string,
): Promise<TApiResponseSuccess<TTeamWeekScheduleResponse>> => {
  return http.get(EMPLOYEE_SCHEDULE_ENDPOINTS.TEAM_SCHEDULE, {
    params: { startDate, endDate },
  });
};

export const getTeamScheduleQueryOptions = (startDate?: string, endDate?: string) => {
  return queryOptions({
    queryKey: employeeScheduleKeys.teamSchedule(startDate, endDate),
    queryFn: () => getTeamSchedule(startDate, endDate),
  });
};

type UseGetTeamScheduleQueryOptions = {
  startDate?: string;
  endDate?: string;
  config?: QueryConfig<typeof getTeamScheduleQueryOptions>;
};

export const useTeamSchedule = ({
  startDate,
  endDate,
  config,
}: UseGetTeamScheduleQueryOptions = {}) => {
  return useQuery({
    ...getTeamScheduleQueryOptions(startDate, endDate),
    ...config,
  });
};
