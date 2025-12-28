import type { TUpdatePetInfoInput } from '@/features/pets/schemas';
import type { TPet } from '@/features/pets/types';

export function mapPetInfoToFormValues(pet: TPet): TUpdatePetInfoInput {
  return {
    name: pet.name,
    type: pet.type,
    breed: pet.breed,
    gender: pet.gender,
    dateOfBirth: pet.dateOfBirth ? new Date(pet.dateOfBirth) : undefined,
    weight: pet.weight != null ? String(pet.weight) : undefined,
    color: pet.color,
    microchipId: pet.microchipId,
    isNeutered: pet.isNeutered,
  };
}
