import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { mapEmployeeDtoToEntity } from '@/features/employee/domain/employee.transform';
import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import { EmployeeScheduleDetailResponseSchema } from '@/features/employee-schedule/domain/schedule-http-schema';
import {
  mapBreakTemplatesToEntity,
  mapShiftOverridesToEntity,
  mapShiftTemplatesToEntity,
} from '@/features/employee-schedule/domain/schedule.transform';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getEmployeeDetail = ({
  employeeId,
  config,
}: {
  employeeId: string;
  config: AxiosRequestConfig;
}) => {
  return http.get(EMPLOYEE_SCHEDULE_ENDPOINTS.GET_EMPLOYEE(employeeId), config);
};

export const getEmployeeDetailQueryOptions = (employeeId: string) => {
  return queryOptions({
    queryKey: employeeScheduleKeys.employeeDetail(employeeId),
    queryFn: async ({ signal }) => {
      const config = { signal };
      const raw = await getEmployeeDetail({ employeeId, config });
      try {
        const response = EmployeeScheduleDetailResponseSchema.parse(raw);
      } catch (error) {
        console.log(error);
      }
      const response = EmployeeScheduleDetailResponseSchema.parse(raw);
      return {
        employee: mapEmployeeDtoToEntity(response.data.employee),
        schedule: {
          shifts: mapShiftTemplatesToEntity(response.data.schedule.shifts),
          overrides: mapShiftOverridesToEntity(response.data.schedule.overrides),
          breaks: mapBreakTemplatesToEntity(response.data.schedule.breaks),
        },
      };
    },
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
