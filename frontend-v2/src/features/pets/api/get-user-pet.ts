import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { petQueryKeys } from '@/features/pets/api/query-keys';
import { GetPetsResponseSchema } from '@/features/pets/domain/pet-http-schema';
import { mapPetsDtoToEntities } from '@/features/pets/domain/pet.transform';
import { PET_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

export const getUserPets = (config: AxiosRequestConfig) => {
  return http.get(PET_ENDPOINTS.LIST, config);
};

export const getUserPetsQueryOptions = () => {
  return queryOptions({
    queryKey: petQueryKeys.customer.list(),
    queryFn: async ({ signal }) => {
      const config = { signal };
      const raw = await getUserPets(config);
      try {
        const response = GetPetsResponseSchema.parse(raw);
      } catch (error) {
        console.log(error);
      }
      const response = GetPetsResponseSchema.parse(raw);
      return mapPetsDtoToEntities(response.data);
    },
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
