import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { bookingQueryKeys } from '@/features/booking/api/query-keys';
import { bookingTodayStatisticResponseSchema } from '@/features/booking/domain/booking-http-schema';
import type { BookingTodayStatisticQuery } from '@/features/booking/domain/booking.state';
import {
  mapBookingTodayStatisticDtoToEntity,
  mapBookingTodayStatisticQueryToDto,
} from '@/features/booking/domain/booking.transform';
import { BOOKING_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getBookingStatisticToday = (config: AxiosRequestConfig) => {
  return http.get(BOOKING_ENDPOINTS.TODAY_STATISTICS, config);
};

export const getAdminBookingTodayStatisticQueryOptions = (query: BookingTodayStatisticQuery) => {
  return queryOptions({
    queryKey: bookingQueryKeys.admin.today_statistic(query),
    queryFn: async ({ signal }) => {
      const queryDto = mapBookingTodayStatisticQueryToDto(query);
      const config = { signal, params: queryDto };
      const raw = await getBookingStatisticToday(config);
      const response = bookingTodayStatisticResponseSchema.parse(raw);
      return mapBookingTodayStatisticDtoToEntity(response.stats);
    },
  });
};

type UseAdminBookingStatisticQueryOptions = {
  query: BookingTodayStatisticQuery;
  queryConfig?: QueryConfig<typeof getAdminBookingTodayStatisticQueryOptions>;
};
export const useEmployeeBookingStatistic = ({
  query,
  queryConfig,
}: UseAdminBookingStatisticQueryOptions) => {
  return useQuery({
    ...getAdminBookingTodayStatisticQueryOptions(query),
    ...queryConfig,
  });
};

export const getEmployeeBookingTodayStatisticQueryOptions = () => {
  return queryOptions({
    queryKey: bookingQueryKeys.employee.today_statistics(),
    queryFn: async ({ signal }) => {
      const config = { signal };
      const raw = await getBookingStatisticToday(config);
      const response = bookingTodayStatisticResponseSchema.parse(raw);
      return mapBookingTodayStatisticDtoToEntity(response.stats);
    },
  });
};

type UseEmployeeTodayBookingStatisticQueryOptions = {
  queryConfig?: QueryConfig<typeof getEmployeeBookingTodayStatisticQueryOptions>;
};
export const useEmployeeBookingTodayStatistic = ({
  queryConfig,
}: UseEmployeeTodayBookingStatisticQueryOptions = {}) => {
  return useQuery({
    ...getEmployeeBookingTodayStatisticQueryOptions(),
    ...queryConfig,
  });
};
