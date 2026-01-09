import { queryOptions, useQuery } from '@tanstack/react-query';

import { bookingQueryKey } from '@/features/booking/api/api-key';
import type { TGetAvailableEmployeesApiResponse } from '@/features/booking/api/types';
import { AVAILABILITY_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getBookableEmployees = (serviceId: string): Promise<TGetAvailableEmployeesApiResponse> => {
  return http.get(AVAILABILITY_ENDPOINTS.BOOKABLE_EMPLOYEES(serviceId));
};

export const getBookableEmployeesQueryOptions = (serviceId: string) => {
  return queryOptions({
    queryKey: bookingQueryKey.avaibilityEmployees({ serviceId }),
    queryFn: () => getBookableEmployees(serviceId),
  });
};

type UseGetAvailableEmployeesOptions = {
  serviceId: string;
  queryConfig?: QueryConfig<typeof getBookableEmployeesQueryOptions>;
};

export const useGetBookableEmployees = ({
  serviceId,
  queryConfig,
}: UseGetAvailableEmployeesOptions) => {
  return useQuery({
    ...getBookableEmployeesQueryOptions(serviceId),
    ...queryConfig,
  });
};
