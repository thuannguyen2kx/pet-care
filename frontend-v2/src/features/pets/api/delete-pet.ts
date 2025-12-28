import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getUserPetsQueryOptions } from './get-user-pet';

import { getPetQueryOptions } from '@/features/pets/api/get-pet';
import { PET_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const deletePet = (petId: string) => {
  return http.delete(PET_ENDPOINTS.DELETE(petId));
};

type UseDeletePetOptions = {
  mutationConfig?: MutationConfig<typeof deletePet>;
};

export const useDeletePet = ({ mutationConfig }: UseDeletePetOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      queryClient.removeQueries({ queryKey: getPetQueryOptions(variables).queryKey });
      queryClient.invalidateQueries({ queryKey: getUserPetsQueryOptions().queryKey });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: deletePet,
  });
};
