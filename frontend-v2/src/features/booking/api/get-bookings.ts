import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { bookingQueryKeys } from '@/features/booking/api/query-keys';
import { getBookingsResponseDtoSchema } from '@/features/booking/domain/booking-http-schema';
import type { CustomerBookingQuery } from '@/features/booking/domain/booking.state';
import {
  mapCustomerBookingQueryToDto,
  mapGetBookingsResponseDtoToResult,
} from '@/features/booking/domain/booking.transform';
import { BOOKING_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getBooking = (config: AxiosRequestConfig): Promise<unknown> => {
  return http.get(BOOKING_ENDPOINTS.LIST, config);
};

export const getBookingsQueryOptions = (query: CustomerBookingQuery) => {
  return queryOptions({
    queryKey: bookingQueryKeys.customer.list(query),
    queryFn: async ({ signal }) => {
      const queryDto = mapCustomerBookingQueryToDto(query);
      const config = { signal, params: queryDto };
      const raw = await getBooking(config);
      const response = getBookingsResponseDtoSchema.parse(raw);
      return mapGetBookingsResponseDtoToResult(response);
    },
    placeholderData: keepPreviousData,
  });
};

type UseGetBookingsQueryOptions = {
  query: CustomerBookingQuery;
  queryConfig?: QueryConfig<typeof getBookingsQueryOptions>;
};

export const useBookings = ({ query, queryConfig }: UseGetBookingsQueryOptions) => {
  return useQuery({
    ...getBookingsQueryOptions(query),
    ...queryConfig,
  });
};
