import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { customerQueryKey } from '@/features/customer/api/query-keys';
import { GetCustomerListResponseSchema } from '@/features/customer/domain/customer-http-schema';
import type { CustomersQuery } from '@/features/customer/domain/customer-state';
import {
  mapCustomerListDtoToEntity,
  mapCustomersQueryToDto,
} from '@/features/customer/domain/customer-transform';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getCustomers = (config: AxiosRequestConfig) => {
  return http.get(USER_ENDPOINTS.CUSTOMER_LIST, config);
};

export const getCustomersQueryOptions = (query: CustomersQuery) => {
  return queryOptions({
    queryKey: customerQueryKey.admin_customer(query),
    queryFn: async ({ signal }) => {
      const queryDto = mapCustomersQueryToDto(query);
      const config = { signal, params: queryDto };
      const raw = await getCustomers(config);
      const response = GetCustomerListResponseSchema.parse(raw);

      return {
        customers: mapCustomerListDtoToEntity(response.data.customers),
        pagination: response.data.pagination,
      };
    },
  });
};
type UseCustomersOptions = {
  query: CustomersQuery;
  queryConfig?: QueryConfig<typeof getCustomersQueryOptions>;
};

export const useCustomers = ({ query, queryConfig }: UseCustomersOptions) => {
  return useQuery({
    ...getCustomersQueryOptions(query),
    ...queryConfig,
  });
};
