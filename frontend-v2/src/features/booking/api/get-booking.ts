import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { bookingQueryKeys } from '@/features/booking/api/query-keys';
import { bookingDetailResponseDtoSchema } from '@/features/booking/domain/booking-http-schema';
import { mapBookingDetailDtoToEntity } from '@/features/booking/domain/booking.transform';
import { BOOKING_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getBooking = (bookingId: string, config: AxiosRequestConfig) => {
  return http.get(BOOKING_ENDPOINTS.DETAIL(bookingId), config);
};

export const getBookingQuertOptions = (bookinngId: string) => {
  return queryOptions({
    queryKey: bookingQueryKeys.customer.detail(bookinngId),
    queryFn: async ({ signal }) => {
      const config = { signal };
      const raw = await getBooking(bookinngId, config);
      const response = bookingDetailResponseDtoSchema.parse(raw);
      return mapBookingDetailDtoToEntity(response.booking);
    },
    enabled: Boolean(bookinngId),
  });
};
type UseGetBookingQueryOptions = {
  bookingId: string;
  queryConfig?: QueryConfig<typeof getBookingQuertOptions>;
};
export const useBooking = ({ bookingId, queryConfig }: UseGetBookingQueryOptions) => {
  return useQuery({
    ...getBookingQuertOptions(bookingId),
    ...queryConfig,
  });
};
