import type z from 'zod';

import {
  petAllergiesSchema,
  petImageSchema,
  petMedicalNotesSchema,
} from '@/features/pets/schemas/atomic';
import { petBaseSchema } from '@/features/pets/schemas/pet-base.schema';

export const createPetInputSchema = petBaseSchema.extend({
  petImage: petImageSchema,
  allergies: petAllergiesSchema,
  medicalNotes: petMedicalNotesSchema,
});

export type TCreatePetInput = z.input<typeof createPetInputSchema>;
