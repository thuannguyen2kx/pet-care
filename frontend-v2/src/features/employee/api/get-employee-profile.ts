import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { employeeQueryKeys } from '@/features/employee/api/query-keys';
import { EmployeeProfileResponseSchema } from '@/features/employee/domain/employee-http-schema';
import { mapEmployeeDtoToEntity } from '@/features/employee/domain/employee.transform';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import { type QueryConfig } from '@/shared/lib/react-query';

const getEmployeeProfile = (config: AxiosRequestConfig) => {
  return http.get(USER_ENDPOINTS.PROFILE, config);
};

export const getProfleQueryOptions = () => {
  return queryOptions({
    queryKey: employeeQueryKeys.employee.profile(),
    queryFn: async ({ signal }) => {
      const config = { signal };
      const raw = await getEmployeeProfile(config);

      const response = EmployeeProfileResponseSchema.parse(raw);
      return mapEmployeeDtoToEntity(response.data.user);
    },
  });
};
type UseEmployeeProfileOptions = {
  queryConfig?: QueryConfig<typeof getProfleQueryOptions>;
};

export const useEmployeeProfile = ({ queryConfig }: UseEmployeeProfileOptions = {}) => {
  return useQuery({
    ...getProfleQueryOptions(),
    ...queryConfig,
  });
};
