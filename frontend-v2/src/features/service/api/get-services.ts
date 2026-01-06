import { queryOptions, useQuery } from '@tanstack/react-query';

import { serviceQueryKey } from '@/features/service/api/query-key';
import type { TGetServicesApiResponse, TServiceQueryPayload } from '@/features/service/api/types';
import { SERVICE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getServices = (filter: TServiceQueryPayload): Promise<TGetServicesApiResponse> => {
  return http.get(SERVICE_ENDPOINTS.LIST, {
    params: filter,
  });
};

export const getServicesQueryOptions = (filter: TServiceQueryPayload) => {
  return queryOptions({
    queryKey: serviceQueryKey.adminList(filter),
    queryFn: () => getServices(filter),
  });
};

type UseGetServicesOptions = {
  filter: TServiceQueryPayload;
  queryConfig?: QueryConfig<typeof getServicesQueryOptions>;
};

export const useGetServices = ({ filter, queryConfig }: UseGetServicesOptions) => {
  return useQuery({
    ...getServicesQueryOptions(filter),
    ...queryConfig,
  });
};
