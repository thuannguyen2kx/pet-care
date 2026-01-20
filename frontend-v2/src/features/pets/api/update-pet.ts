import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { getPetQueryOptions } from './get-pet';

import { UpdatePetResponse } from '@/features/pets/domain/pet-http-schema';
import type { UpdatePetDto } from '@/features/pets/domain/pet.dto';
import type { Pet } from '@/features/pets/domain/pet.entity';
import type { UpdatePet } from '@/features/pets/domain/pet.state';
import { mapPetDtoToEntity, mapUpdatePetToDto } from '@/features/pets/domain/pet.transform';
import { PET_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

export const updatePet = ({
  petId,
  updatePetDto,
}: {
  petId: string;
  updatePetDto: UpdatePetDto;
}) => {
  return http.put(PET_ENDPOINTS.UPDATE(petId), updatePetDto);
};

type UseUpdatePetOptions = {
  mutationConfig?: UseMutationOptions<Pet, unknown, UpdatePet, unknown>;
};

export const useUpdatePet = ({ mutationConfig }: UseUpdatePetOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      queryClient.setQueryData(getPetQueryOptions(variables.petId).queryKey, data);
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: async (updatePetData: UpdatePet) => {
      const updatePetDto = mapUpdatePetToDto(updatePetData);
      const raw = await updatePet({ petId: updatePetData.petId, updatePetDto });
      const response = UpdatePetResponse.parse(raw);
      return mapPetDtoToEntity(response.data);
    },
  });
};
