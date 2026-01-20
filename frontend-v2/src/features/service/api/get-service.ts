import { queryOptions, useQuery } from '@tanstack/react-query';

import { serviceQueryKey } from '@/features/service/api/query-keys';
import type { TGetServiceDetailApiResponse } from '@/features/service/api/types';
import { SERVICE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getService = (serviceId: string): Promise<TGetServiceDetailApiResponse> => {
  return http.get(SERVICE_ENDPOINTS.DETAIL(serviceId));
};

export const getSerivceQueryOptions = (serviceId: string) => {
  return queryOptions({
    queryKey: serviceQueryKey.adminDetail(serviceId),
    queryFn: () => getService(serviceId),
  });
};

type UseGetServiceQueryOptions = {
  serviceId: string;
  queryConfig?: QueryConfig<typeof getSerivceQueryOptions>;
};

export const useGetService = ({ serviceId, queryConfig }: UseGetServiceQueryOptions) => {
  return useQuery({
    ...getSerivceQueryOptions(serviceId),
    ...queryConfig,
  });
};
