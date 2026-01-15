import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { bookingQueryKeys } from '@/features/booking/api/query-keys';
import { bookingScheduleResponseSchema } from '@/features/booking/domain/booking-http-schema';
import type { employeeBookingScheduleQuery } from '@/features/booking/domain/booking.state';
import {
  mapBookingScheduleDaysDtoToEntities,
  mapEmployeeBookingScheduleQueryToDto,
} from '@/features/booking/domain/booking.transform';
import { BOOKING_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getBookingSchedule = (config: AxiosRequestConfig) => {
  return http.get(BOOKING_ENDPOINTS.SCHEDULE, config);
};

export const getEmployeeBookingScheduleQueryOptions = (query: employeeBookingScheduleQuery) => {
  return queryOptions({
    queryKey: bookingQueryKeys.employee.booking_schedule(query),
    queryFn: async ({ signal }) => {
      const queryDto = mapEmployeeBookingScheduleQueryToDto(query);
      const config = { signal, params: queryDto };
      const raw = await getBookingSchedule(config);
      const response = bookingScheduleResponseSchema.parse(raw);

      return mapBookingScheduleDaysDtoToEntities(response.data.days);
    },
  });
};

type UseEmployeeBookingSchedule = {
  query: employeeBookingScheduleQuery;
  queryConfig?: QueryConfig<typeof getEmployeeBookingScheduleQueryOptions>;
};

export const useEmployeeBookingSchedule = ({ query, queryConfig }: UseEmployeeBookingSchedule) => {
  return useQuery({
    ...getEmployeeBookingScheduleQueryOptions(query),
    ...queryConfig,
  });
};
