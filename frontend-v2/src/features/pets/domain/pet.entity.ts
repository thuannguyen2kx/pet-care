import { z } from 'zod';

import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

export const PetTypeSchema = z.enum(['dog', 'cat']);
export const PetGenderSchema = z.enum(['male', 'female']);

export const PetVaccinationSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.date(),
  expiryDate: z.date().optional(),
  nextDueDate: z.date().optional(),
  batchNumber: z.string().optional(),
  veterinarianName: z.string().optional(),
  clinicName: z.string().optional(),
  certificate: z.string().optional(),
  notes: z.string().optional(),
});

export const PetMedicalRecordSchema = z.object({
  id: z.string(),
  condition: z.string(),
  diagnosis: z.date(),
  treatment: z.string().optional(),
  veterinarianName: z.string().optional(),
  clinicName: z.string().optional(),
  followUpDate: z.date().optional(),
  cost: z.number().positive().optional(),
  notes: z.string().optional(),
});

export const PetSchema = z.object({
  id: mongoObjectIdSchema,
  ownerId: mongoObjectIdSchema,
  name: z.string(),
  type: PetTypeSchema,
  breed: z.string(),
  gender: PetGenderSchema,
  dateOfBirth: z.date(),
  weight: z.number().positive(),
  color: z.string(),
  microchipId: z.string().optional(),
  isNeutered: z.boolean(),
  allergies: z.array(z.string()),
  medicalNotes: z.string().optional(),
  vaccinations: z.array(PetVaccinationSchema).optional(),
  medicalHistory: z.array(PetMedicalRecordSchema).optional(),
  image: z.url().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// =======================
// Types
// =======================
export type PetType = z.infer<typeof PetTypeSchema>;
export type PetGender = z.infer<typeof PetGenderSchema>;
export type PetVaccination = z.infer<typeof PetVaccinationSchema>;
export type PetMedicalRecord = z.infer<typeof PetMedicalRecordSchema>;
export type Pet = z.infer<typeof PetSchema>;

// =======================
// Constants
// =======================
export const PET_TYPES = {
  DOG: 'dog',
  CAT: 'cat',
} as const;
export const PET_GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
} as const;
export const DOG_BREEDS = ['Golden Retriever', 'Poodle', 'Corgi', 'Shiba Inu', 'Husky'];
export const CAT_BREEDS = ['Scottish Fold', 'British Shorthair', 'Munchkin', 'Persian', 'Ragdoll'];
