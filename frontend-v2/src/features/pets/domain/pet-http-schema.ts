import z from 'zod';

import { PetDtoSchema } from '@/features/pets/domain/pet.dto';

export const GetPetsResponseSchema = z.object({
  data: z.array(PetDtoSchema),
});

export const GetPetDetailResponse = z.object({
  data: PetDtoSchema,
});
export const UpdatePetResponse = z.object({
  data: PetDtoSchema,
});
