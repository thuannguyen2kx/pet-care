import { queryOptions, useQuery } from '@tanstack/react-query';

import { userKeys } from '@/features/user/api/query-key';
import type { TProfile } from '@/features/user/types';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import { type QueryConfig } from '@/shared/lib/react-query';
import type { TApiResponseSuccess } from '@/shared/types';

const getProfile = (): Promise<TApiResponseSuccess<{ user: TProfile }>> => {
  return http.get(USER_ENDPOINTS.PROFILE);
};

export const getProfleQueryOptions = () => {
  return queryOptions({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const res = await getProfile();
      return res.data.user;
    },
  });
};
type UseGetProfileOptions = {
  queryConfig?: QueryConfig<typeof getProfleQueryOptions>;
};

export const useGetProfile = ({ queryConfig }: UseGetProfileOptions = {}) => {
  return useQuery({
    ...getProfleQueryOptions(),
    ...queryConfig,
  });
};
