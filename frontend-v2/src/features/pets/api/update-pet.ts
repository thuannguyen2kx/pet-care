import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getPetQueryOptions } from './get-pet';

import type {
  TUpdatePetAllergiesPayload,
  TUpdatePetInfoInput,
  TUpdatePetMedicalNotesInput,
} from '@/features/pets/schemas';
import { PET_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';
import type { TPet } from '@/shared/types/pet';

export const updatePet = ({
  petId,
  data,
}: {
  petId: string;
  data: TUpdatePetInfoInput | TUpdatePetMedicalNotesInput | TUpdatePetAllergiesPayload;
}): Promise<{ data: TPet }> => {
  return http.put(PET_ENDPOINTS.UPDATE(petId), data);
};

type UseUpdatePetOptions = {
  petId: string;
  mutationConfig?: MutationConfig<typeof updatePet>;
};

export const useUpdatePet = ({ petId, mutationConfig }: UseUpdatePetOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.setQueryData(getPetQueryOptions(petId).queryKey, { data: data.data });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updatePet,
  });
};
