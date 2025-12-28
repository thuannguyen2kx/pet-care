import { queryOptions, useQuery } from '@tanstack/react-query';

import { PET_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';
import type { TPet } from '@/shared/types/pet';

export const getPet = (petId: string): Promise<{ data: TPet }> => {
  return http.get(PET_ENDPOINTS.DETAIL(petId));
};

export const getPetQueryOptions = (petId: string) => {
  return queryOptions({
    queryKey: ['pets', petId],
    queryFn: () => getPet(petId),
  });
};

type UsePetOptions = {
  petId: string;
  queryConfig?: QueryConfig<typeof getPetQueryOptions>;
};

export const useGetPet = ({ petId, queryConfig }: UsePetOptions) => {
  return useQuery({
    ...getPetQueryOptions(petId),
    ...queryConfig,
  });
};
