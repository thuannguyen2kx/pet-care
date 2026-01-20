import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { serviceQueryKeys } from '@/features/service/api/query-keys';
import type { ServicesQuery } from '@/features/service/domain/serivice.state';
import { GetServicesResponseSchema } from '@/features/service/domain/service-http-schema';
import {
  mapServicesDtoToEntities,
  mapServicesQueryToDto,
} from '@/features/service/domain/service.transform';
import { SERVICE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getServices = (config: AxiosRequestConfig) => {
  return http.get(SERVICE_ENDPOINTS.LIST, config);
};

export const getServicesQueryOptions = (query: ServicesQuery) => {
  return queryOptions({
    queryKey: serviceQueryKeys.customer.list(query),
    queryFn: async ({ signal }) => {
      const queryDto = mapServicesQueryToDto(query);
      const config = { signal, params: queryDto };
      const raw = await getServices(config);
      const response = GetServicesResponseSchema.parse(raw);

      return {
        services: mapServicesDtoToEntities(response.data.services),
        pagination: response.data.pagination,
      };
    },
  });
};

type UseGetServicesOptions = {
  filter: ServicesQuery;
  queryConfig?: QueryConfig<typeof getServicesQueryOptions>;
};

export const useGetServices = ({ filter, queryConfig }: UseGetServicesOptions) => {
  return useQuery({
    ...getServicesQueryOptions(filter),
    ...queryConfig,
  });
};

export const getAdminServicesQueryOptions = (query: ServicesQuery) => {
  return queryOptions({
    queryKey: serviceQueryKeys.admin.list(query),
    queryFn: async ({ signal }) => {
      const queryDto = mapServicesQueryToDto(query);
      const config = { signal, params: queryDto };
      const raw = await getServices(config);
      const response = GetServicesResponseSchema.parse(raw);

      return {
        services: mapServicesDtoToEntities(response.data.services),
        pagination: response.data.pagination,
      };
    },
  });
};

type UseAdminGetServicesOptions = {
  filter: ServicesQuery;
  queryConfig?: QueryConfig<typeof getAdminServicesQueryOptions>;
};

export const useGetAdminServices = ({ filter, queryConfig }: UseAdminGetServicesOptions) => {
  return useQuery({
    ...getAdminServicesQueryOptions(filter),
    ...queryConfig,
  });
};
