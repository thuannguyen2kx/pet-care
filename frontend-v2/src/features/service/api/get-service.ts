import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { serviceQueryKeys } from '@/features/service/api/query-keys';
import { GetServiceDetailResponseSchema } from '@/features/service/domain/service-http-schema';
import { mapServiceDtoToEntity } from '@/features/service/domain/service.transform';
import { SERVICE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getService = ({ serviceId, config }: { serviceId: string; config: AxiosRequestConfig }) => {
  return http.get(SERVICE_ENDPOINTS.DETAIL(serviceId), config);
};

export const getSerivceQueryOptions = (serviceId: string) => {
  return queryOptions({
    queryKey: serviceQueryKeys.admin.detail(serviceId),
    queryFn: async ({ signal }) => {
      const config = { signal };
      const raw = await getService({ serviceId, config });
      const response = GetServiceDetailResponseSchema.parse(raw);

      return mapServiceDtoToEntity(response.data.service);
    },
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
