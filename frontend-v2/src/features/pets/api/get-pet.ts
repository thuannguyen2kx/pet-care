import { queryOptions, useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import { petQueryKeys } from '@/features/pets/api/query-keys';
import { GetPetDetailResponse } from '@/features/pets/domain/pet-http-schema';
import { mapPetDtoToEntity } from '@/features/pets/domain/pet.transform';
import { PET_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { QueryConfig } from '@/shared/lib/react-query';

export const getPet = ({ petId, config }: { petId: string; config: AxiosRequestConfig }) => {
  return http.get(PET_ENDPOINTS.DETAIL(petId), config);
};

export const getPetQueryOptions = (petId: string) => {
  return queryOptions({
    queryKey: petQueryKeys.customer.detail(petId),
    queryFn: async ({ signal }) => {
      const config = { signal };
      const raw = await getPet({ petId, config });
      const response = GetPetDetailResponse.parse(raw);
      return mapPetDtoToEntity(response.data);
    },
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
