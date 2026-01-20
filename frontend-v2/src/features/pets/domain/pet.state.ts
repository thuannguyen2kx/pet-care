import z from 'zod';

import { PetGenderSchema, PetTypeSchema } from '@/features/pets/domain/pet.entity';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/shared/constant';
import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

export const PetsQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  type: PetTypeSchema.optional(),
  gender: PetGenderSchema.optional(),
  minAge: z.coerce.number().optional(),
  maxAge: z.coerce.number().optional(),
  minWeight: z.coerce.number().optional(),
  maxWeight: z.coerce.number().optional(),
  isNeutered: z.coerce.boolean().optional(),
  hasUpcomingVaccinations: z.coerce.boolean().optional(),
});
export const PetAllergyItemSchema = z.object({
  value: z.string().min(1),
});
export const PetImageSchema = z
  .instanceof(File, { message: 'Vui lòng tải ảnh thú cưng' })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), 'Chỉ hỗ trợ JPG, PNG, WEBP')
  .refine((file) => file.size <= MAX_FILE_SIZE, 'Dung lượng ảnh tối đa 2MB');

export const PetMedicalNotesSchema = z.string().max(2000).optional();

export const PetBaseSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên thú cưng'),
  type: z.enum(PetTypeSchema.options, {
    message: 'Vui lòng chọn loại thú cưng',
  }),
  breed: z.string().min(1, 'Vui lòng chọn giống'),
  gender: z.enum(PetGenderSchema.options, {
    message: 'Vui lòng chọn giới tính',
  }),
  dateOfBirth: z
    .date()
    .nullable()
    .refine((date) => date !== null, {
      message: 'Vui lòng chọn ngày sinh',
    })
    .refine((date) => !date || date <= new Date(), {
      message: 'Ngày sinh không hợp lệ',
    }),
  weight: z.coerce.number('Vui lòng nhập cân nặng').positive('Cân nặng phải là số dương'),

  color: z.string().min(1, 'Vui lòng nhập màu lông'),
  microchipId: z.string().optional(),
  isNeutered: z.boolean(),
  allergies: z.array(PetAllergyItemSchema),
  medicalNotes: z.string().optional(),
});

export const UpdatePetInfoSchema = PetBaseSchema.pick({
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
  .partial()
  .extend({
    petId: mongoObjectIdSchema,
  });

export const CreatePetSchema = PetBaseSchema.extend({
  petImage: PetImageSchema,
  allergies: z.array(PetAllergyItemSchema),
  medicalNotes: PetMedicalNotesSchema,
});

export const UpdatePetAllergiesSchema = z.object({
  petId: mongoObjectIdSchema,
  allergies: z.array(PetAllergyItemSchema),
});
export const UpdatePetMedicalNotesSchema = z.object({
  petId: mongoObjectIdSchema,
  medicalNotes: PetMedicalNotesSchema,
});
export const UpdatePetImageSchema = z.object({
  petId: mongoObjectIdSchema,
  petImage: PetImageSchema,
});

// =======================
// Types
// =======================
export type PetsQuery = z.infer<typeof PetsQuerySchema>;
export type UpdatePetInfo = z.infer<typeof UpdatePetInfoSchema>;
export type PetImage = z.infer<typeof PetImageSchema>;
export type UpdatePetAllergies = z.infer<typeof UpdatePetAllergiesSchema>;
export type UpdatePetMedicalNotes = z.infer<typeof UpdatePetMedicalNotesSchema>;
export type UpdatePetImage = z.infer<typeof UpdatePetImageSchema>;
export type CreatePet = z.infer<typeof CreatePetSchema>;
export type UpdatePet =
  | ({ kind: 'info' } & UpdatePetInfo)
  | ({ kind: 'allergies' } & UpdatePetAllergies)
  | ({ kind: 'medicalNotes' } & UpdatePetMedicalNotes);
// =========================
// Constants
// =========================
export const CreatePetStepSchemas = {
  1: CreatePetSchema.pick({
    name: true,
    type: true,
    breed: true,
    gender: true,
    petImage: true,
  }),
  2: CreatePetSchema.pick({
    dateOfBirth: true,
    weight: true,
    color: true,
  }),
  3: CreatePetSchema.pick({
    medicalNotes: true,
    allergies: true,
  }),
} as const;
