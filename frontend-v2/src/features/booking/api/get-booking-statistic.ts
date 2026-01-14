import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { bookingQueryKeys } from '@/features/booking/api/query-keys';
import { bookingStatisticResponseSchema } from '@/features/booking/domain/booking-http-schema';
import type { BookingStatisticQuery } from '@/features/booking/domain/booking.state';
import { mapBookingStatisticDtoToEntity } from '@/features/booking/domain/booking.transform';
import { BOOKING_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getBookingStatistic = (config: AxiosRequestConfig) => {
  return http.get(BOOKING_ENDPOINTS.STATISTICS, config);
};

export const getBookingStatisticQueryOptions = (query?: BookingStatisticQuery) => {
  return queryOptions({
    queryKey: bookingQueryKeys.admin.statistic(query),
    queryFn: async ({ signal }) => {
      const config = { signal, params: query };
      const raw = await getBookingStatistic(config);
      const response = bookingStatisticResponseSchema.parse(raw);
      return mapBookingStatisticDtoToEntity(response.stats);
    },
  });
};

type UseAdminBookingStatisticQueryOptions = {
  query?: BookingStatisticQuery;
  queryConfig?: QueryConfig<typeof getBookingStatisticQueryOptions>;
};
export const useAdminBookingStatistic = ({
  query,
  queryConfig,
}: UseAdminBookingStatisticQueryOptions = {}) => {
  return useQuery({
    ...getBookingStatisticQueryOptions(query),
    ...queryConfig,
  });
};
