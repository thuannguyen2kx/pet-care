import { z } from 'zod';

import { petAllergiesSchema, petImageSchema, petMedicalNotesSchema } from './atomic';
import { petBaseSchema } from './pet-base.schema';

/**
 * Update info (profile)
 */
export const updatePetInfoInputSchema = petBaseSchema
  .pick({
    name: true,
    type: true,
    breed: true,
    gender: true,
    dateOfBirth: true,
    weight: true,
    color: true,
    microchipId: true,
    isNeutered: true,
  })
  .partial();

export type TUpdatePetInfoInput = z.infer<typeof updatePetInfoInputSchema>;

/**
 * Update allergies
 */
export const updatePetAllergiesInputSchema = z.object({
  allergies: petAllergiesSchema,
});

export type TUpdatePetAllergiesInput = z.input<typeof updatePetAllergiesInputSchema>;

/**
 * Payload backend expects
 */
export type TUpdatePetAllergiesPayload = {
  allergies: string[];
};

/**
 * Update medical notes
 */
export const updatePetMedicalNotesInputSchema = z.object({
  medicalNotes: petMedicalNotesSchema,
});

export type TUpdatePetMedicalNotesInput = z.infer<typeof updatePetMedicalNotesInputSchema>;

/**
 * Update pet image
 */
export const updatePetImageInputSchema = z.object({
  petImage: petImageSchema,
});

export type TUpdatePetImageInput = z.infer<typeof updatePetImageInputSchema>;
