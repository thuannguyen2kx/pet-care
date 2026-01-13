import { queryOptions, useQuery } from '@tanstack/react-query';

import type { TPet } from '@/features/pets/types';
import { PET_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

export const getUserPets = (): Promise<{ data: TPet[] }> => {
  return http.get(PET_ENDPOINTS.LIST);
};

export const getUserPetsQueryOptions = () => {
  return queryOptions({
    queryKey: ['pets'],
    queryFn: () => getUserPets(),
  });
};

type UseUserPetsOptions = {
  queryConfig?: QueryConfig<typeof getUserPetsQueryOptions>;
};
export const useGetUserPets = ({ queryConfig }: UseUserPetsOptions = {}) => {
  return useQuery({
    ...getUserPetsQueryOptions(),
    ...queryConfig,
  });
};
