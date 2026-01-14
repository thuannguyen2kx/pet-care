import { queryOptions, useQuery } from '@tanstack/react-query';

import { customerQueryKey } from '@/features/customer/api/query-keys';
import { mapCustomerDtoToEntity } from '@/features/customer/domain/customer-transform';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

const getProfile = (): Promise<unknown> => {
  return http.get(USER_ENDPOINTS.PROFILE);
};

export const getCustomerProfileQueryOptions = () => {
  return queryOptions({
    queryKey: customerQueryKey.profile(),
    queryFn: getProfile,
    select: (raw) => {
      return mapCustomerDtoToEntity(raw);
    },
  });
};

type UseGetProfileOptions = {
  queryConfig?: QueryConfig<typeof getCustomerProfileQueryOptions>;
};

export const useCustomerProfile = ({ queryConfig }: UseGetProfileOptions = {}) => {
  return useQuery({
    ...getCustomerProfileQueryOptions(),
    ...queryConfig,
  });
};
