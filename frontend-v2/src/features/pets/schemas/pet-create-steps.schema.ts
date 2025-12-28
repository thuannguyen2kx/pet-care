import { createPetInputSchema } from '@/features/pets/schemas/pet-create.schema';

export const stepSchemas = {
  1: createPetInputSchema.pick({
    name: true,
    type: true,
    breed: true,
    gender: true,
    petImage: true,
  }),
  2: createPetInputSchema.pick({
    dateOfBirth: true,
    weight: true,
    color: true,
  }),
  3: createPetInputSchema.pick({
    medicalNotes: true,
    allergies: true,
  }),
} as const;

export type TCreatePetFormStep = keyof typeof stepSchemas;
