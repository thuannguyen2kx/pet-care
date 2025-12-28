import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getPetQueryOptions } from './get-pet';

import { PET_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

export const updatePetImage = ({ petId, data }: { petId: string; data: FormData }) => {
  return http.post(PET_ENDPOINTS.UPDATE_IMAGE(petId), data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseUpdatePetImageOptions = {
  petId: string;
  mutationConfig?: MutationConfig<typeof updatePetImage>;
};

export const useUpdatePetImage = ({ petId, mutationConfig }: UseUpdatePetImageOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.refetchQueries({
        queryKey: getPetQueryOptions(petId).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updatePetImage,
  });
};
