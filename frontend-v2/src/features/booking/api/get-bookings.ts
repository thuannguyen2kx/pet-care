import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { bookingQueryKeys } from '@/features/booking/api/query-keys';
import { getBookingsResponseDtoSchema } from '@/features/booking/domain/booking-http-schema';
import type {
  AdminBookingQuery,
  CustomerBookingQuery,
  EmployeeBookingQuery,
} from '@/features/booking/domain/booking.state';
import {
  mapAdminBookingQueryToDto,
  mapCustomerBookingQueryToDto,
  mapEmployeeBookingQueryToDto,
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

export const getAdminBookingsQueryOptions = (query: AdminBookingQuery) => {
  return queryOptions({
    queryKey: bookingQueryKeys.admin.list(query),
    queryFn: async ({ signal }) => {
      const queryDto = mapAdminBookingQueryToDto(query);
      const config = { signal, params: queryDto };
      const raw = await getBooking(config);
      const response = getBookingsResponseDtoSchema.parse(raw);
      return mapGetBookingsResponseDtoToResult(response);
    },
    placeholderData: keepPreviousData,
  });
};
type UseAdminBookingsQueryOptions = {
  query: AdminBookingQuery;
  queryConfig?: QueryConfig<typeof getAdminBookingsQueryOptions>;
};

export const useAdminBookings = ({ query, queryConfig }: UseAdminBookingsQueryOptions) => {
  return useQuery({
    ...getAdminBookingsQueryOptions(query),
    ...queryConfig,
  });
};

export const getEmployeeBookingsQueryOptions = (query: EmployeeBookingQuery) => {
  return queryOptions({
    queryKey: bookingQueryKeys.employee.list(query),
    queryFn: async ({ signal }) => {
      const queryDto = mapEmployeeBookingQueryToDto(query);
      const config = { signal, params: queryDto };
      const raw = await getBooking(config);
      const response = getBookingsResponseDtoSchema.parse(raw);
      return mapGetBookingsResponseDtoToResult(response);
    },
    placeholderData: keepPreviousData,
  });
};
type UseEmployeeBookingsQueryOptions = {
  query: EmployeeBookingQuery;
  queryConfig?: QueryConfig<typeof getEmployeeBookingsQueryOptions>;
};

export const useEmployeeBookings = ({ query, queryConfig }: UseEmployeeBookingsQueryOptions) => {
  return useQuery({
    ...getEmployeeBookingsQueryOptions(query),
    ...queryConfig,
  });
};
