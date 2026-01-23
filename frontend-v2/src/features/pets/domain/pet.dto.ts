import z from 'zod';

import { PetGenderSchema, PetTypeSchema } from '@/features/pets/domain/pet.entity';
import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

// =====================
// Requests Dto
// =====================
export const PetsQueryDtoSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  type: z.enum(['dog', 'cat']).optional(),
  gender: z.enum(['male', 'female']).optional(),
  minAge: z.coerce.number().optional(),
  maxAge: z.coerce.number().optional(),
  minWeight: z.coerce.number().optional(),
  maxWeight: z.coerce.number().optional(),
  isNeutered: z.coerce.boolean().optional(),
  hasUpcomingVaccinations: z.coerce.boolean().optional(),
});

export const UpdatePetSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Vui lòng nhập tên thú cưng')
      .max(100, 'Tên không được quá 100 ký tự')
      .optional(),

    type: PetTypeSchema.optional(),

    breed: z.string().min(1, 'Vui lòng chọn giống').optional(),

    gender: PetGenderSchema.optional(),

    dateOfBirth: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Ngày sinh không hợp lệ',
      })
      .refine((val) => new Date(val) <= new Date(), {
        message: 'Ngày sinh không thể ở tương lai',
      })
      .optional(),

    weight: z.coerce.number().positive('Cân nặng phải là số dương').optional(),

    color: z.string().min(1, 'Vui lòng nhập màu lông').optional(),

    microchipId: z.string().optional(),

    isNeutered: z.coerce.boolean().optional(),

    allergies: z.array(z.string()).optional(),

    medicalNotes: z.string().max(2000, 'Ghi chú không được quá 2000 ký tự').optional(),
  })
  .refine((data) => Object.keys(data).some((key) => key !== 'petId'), {
    message: 'Cần ít nhất một trường để cập nhật',
  });

// ========================
// Response Dto
// ========================
export const PetVaccinationDtoSchema = z.object({
  _id: z.string(),
  name: z.string(),
  date: z.string(),
  expiryDate: z.string().optional(),
  nextDueDate: z.string().optional(),
  batchNumber: z.string().optional(),
  veterinarianName: z.string().optional(),
  clinicName: z.string().optional(),
  certificate: z.string().optional(),
  notes: z.string().optional(),
});

export const PetMedicalRecordDtoSchema = z.object({
  _id: z.string(),
  condition: z.string(),
  diagnosis: z.string(),
  treatment: z.string().optional(),
  veterinarianName: z.string().optional(),
  clinicName: z.string().optional(),
  followUpDate: z.string().optional(),
  cost: z.number().positive().optional(),
  notes: z.string().optional(),
});

export const PetDtoSchema = z.object({
  _id: mongoObjectIdSchema,
  ownerId: mongoObjectIdSchema,
  name: z.string(),
  type: z.enum(['dog', 'cat']),
  breed: z.string(),
  gender: z.enum(['male', 'female']),
  dateOfBirth: z.string(),
  weight: z.coerce.number().positive(),
  color: z.string(),
  microchipId: z.string().optional(),
  isNeutered: z.boolean(),
  allergies: z.array(z.string()),
  medicalNotes: z.string().optional(),
  vaccinations: z.array(PetVaccinationDtoSchema).optional(),
  medicalHistory: z.array(PetMedicalRecordDtoSchema).optional(),
  image: z.object({
    publicId: z.string().nullable(),
    url: z.string().nullable(),
  }),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ========================
// Types
// ========================
export type PetDto = z.infer<typeof PetDtoSchema>;
export type PetVaccinationDto = z.infer<typeof PetVaccinationDtoSchema>;
export type PetMedicalRecordDto = z.infer<typeof PetMedicalRecordDtoSchema>;
export type PetsQueryDto = z.infer<typeof PetsQueryDtoSchema>;
export type UpdatePetDto = z.infer<typeof UpdatePetSchema>;
