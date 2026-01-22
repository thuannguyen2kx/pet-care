import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { employeeKeys } from '@/features/employee/api/query-key';
import { EmployeeDetailResponseSchema } from '@/features/employee/domain/employee-http-schema';
import { mapEmployeeDtoToEntity } from '@/features/employee/domain/employee.transform';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getEmployee = ({
  employeeId,
  config,
}: {
  employeeId: string;
  config?: AxiosRequestConfig;
}) => {
  return http.get(USER_ENDPOINTS.GET_USER(employeeId), config);
};

export const getEmployeeQueryOptions = (employeeId: string) => {
  return queryOptions({
    queryKey: employeeKeys.admin.detail(employeeId),
    queryFn: async ({ signal }) => {
      const config = { signal };
      const raw = await getEmployee({ employeeId, config });
      try {
        const response = EmployeeDetailResponseSchema.parse(raw);
      } catch (error) {
        console.log(error);
      }
      const response = EmployeeDetailResponseSchema.parse(raw);
      return mapEmployeeDtoToEntity(response.data.user);
    },
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
