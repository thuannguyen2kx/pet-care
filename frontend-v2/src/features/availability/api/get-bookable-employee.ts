import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { availabilityQueryKeys } from '@/features/availability/api/query-keys';
import { bookableEmployeesHttpResponseSchema } from '@/features/availability/domain/availability.http-schema';
import { mapBookableEmployeeDtosToEntities } from '@/features/availability/domain/availability.transform';
import { AVAILABILITY_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getBookableEmployees = (serviceId: string, config: AxiosRequestConfig): Promise<unknown> => {
  return http.get(AVAILABILITY_ENDPOINTS.BOOKABLE_EMPLOYEES(serviceId), config);
};

export const getBookableEmployeesQueryOptions = (serviceId: string) => {
  return queryOptions({
    queryKey: availabilityQueryKeys.bookableEmployeesByService(serviceId),
    queryFn: async ({ signal }) => {
      const raw = await getBookableEmployees(serviceId, { signal });
      const response = bookableEmployeesHttpResponseSchema.parse(raw);
      return mapBookableEmployeeDtosToEntities(response.data.employees);
    },
  });
};
type UseGetBookableEmployeesQueryOptions = {
  serviceId: string;
  queryConfig?: QueryConfig<typeof getBookableEmployeesQueryOptions>;
};

export const useBookableEmployees = ({
  serviceId,
  queryConfig,
}: UseGetBookableEmployeesQueryOptions) => {
  return useQuery({
    ...getBookableEmployeesQueryOptions(serviceId),
    enabled: !!serviceId,
    ...queryConfig,
  });
};
