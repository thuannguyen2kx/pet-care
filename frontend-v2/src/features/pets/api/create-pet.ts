import { useMutation } from '@tanstack/react-query';

import { PET_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

export const createPet = ({ data }: { data: FormData }) => {
  return http.post(PET_ENDPOINTS.CREATE, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseCreatePetOptions = {
  mutationConfig?: MutationConfig<typeof createPet>;
};

export const useCreatePet = ({ mutationConfig }: UseCreatePetOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createPet,
  });
};
