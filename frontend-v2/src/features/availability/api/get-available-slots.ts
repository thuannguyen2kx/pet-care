import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { availabilityQueryKeys } from '@/features/availability/api/query-keys';
import { availableSlotsHttpResponseSchema } from '@/features/availability/domain/availability.http-schema';
import type { AvailableSlotsQuery } from '@/features/availability/domain/availability.state';
import {
  mapAvailableSlotDtosToEntities,
  mapAvailableSlotsQueryToDto,
} from '@/features/availability/domain/availability.transform';
import { AVAILABILITY_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getAvailableSlots = (config: AxiosRequestConfig): Promise<unknown> => {
  return http.get(AVAILABILITY_ENDPOINTS.SLOTS, config);
};

export const getAvailableSlotsQueryOptions = (query: AvailableSlotsQuery) => {
  return queryOptions({
    queryKey: availabilityQueryKeys.availableSlotsByEmployeeAndDate(query),
    queryFn: async ({ signal }) => {
      const queryDto = mapAvailableSlotsQueryToDto(query);
      const config = { signal, params: queryDto };
      const raw = await getAvailableSlots(config);
      const response = availableSlotsHttpResponseSchema.parse(raw);

      return mapAvailableSlotDtosToEntities(response.data.slots);
    },
  });
};

type UseGetAvalableSlotsQueryOptions = {
  query: AvailableSlotsQuery;
  queryConfig: QueryConfig<typeof getAvailableSlotsQueryOptions>;
};

export const useAvailableSlots = ({ query, queryConfig }: UseGetAvalableSlotsQueryOptions) => {
  return useQuery({
    ...getAvailableSlotsQueryOptions(query),
    enabled: Boolean(query.employeeId && query.date && query.serviceId),
    ...queryConfig,
  });
};
