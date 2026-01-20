import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import type { CreatePet } from '@/features/pets/domain/pet.state';
import { buildCreatePetFormData, mapCreatePetToDto } from '@/features/pets/domain/pet.transform';
import { PET_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

export const createPet = ({ data }: { data: FormData }) => {
  return http.post(PET_ENDPOINTS.CREATE, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseCreatePetOptions = {
  mutationConfig?: UseMutationOptions<unknown, unknown, CreatePet, unknown>;
};

export const useCreatePet = ({ mutationConfig }: UseCreatePetOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: (createPetData: CreatePet) => {
      const dto = mapCreatePetToDto(createPetData);
      const formData = buildCreatePetFormData(dto);

      return createPet({ data: formData });
    },
  });
};
