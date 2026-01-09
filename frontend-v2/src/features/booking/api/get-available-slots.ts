import { queryOptions, useQuery } from '@tanstack/react-query';

import { bookingQueryKey } from '@/features/booking/api/api-key';
import type { TGetAvaiableSlotsApiResponse } from '@/features/booking/api/types';
import { AVAILABILITY_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getAvailableSlots = ({
  serviceId,
  employeeId,
  date,
}: {
  serviceId: string;
  employeeId: string;
  date: string;
}): Promise<TGetAvaiableSlotsApiResponse> => {
  return http.get(AVAILABILITY_ENDPOINTS.SLOTS, {
    params: {
      serviceId,
      employeeId,
      date,
    },
  });
};

export const getAvailableSlotsQueryOptions = ({
  serviceId,
  employeeId,
  date,
}: {
  serviceId: string;
  employeeId: string;
  date: string;
}) => {
  return queryOptions({
    queryKey: bookingQueryKey.avaibilitySlots({ serviceId, employeeId, date }),
    queryFn: () => getAvailableSlots({ serviceId, employeeId, date }),
  });
};

type UseGetAvailableEmployeeOptions = {
  query: {
    serviceId: string;
    employeeId: string;
    date: string;
  };
  queryConfig?: QueryConfig<typeof getAvailableSlotsQueryOptions>;
};

export const useGetAvailableSlots = ({ query, queryConfig }: UseGetAvailableEmployeeOptions) => {
  return useQuery({
    ...getAvailableSlotsQueryOptions(query),
    ...queryConfig,
  });
};
