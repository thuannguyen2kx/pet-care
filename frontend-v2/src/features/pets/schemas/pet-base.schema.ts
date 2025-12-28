import { z } from 'zod';

import { PET_GENDERS, PET_TYPES } from '@/features/pets/constants';

export const allergyItemSchema = z.object({
  value: z.string().min(1),
});

export const petBaseSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên thú cưng'),

  type: z.enum(PET_TYPES, {
    message: 'Vui lòng chọn loại thú cưng',
  }),

  breed: z.string().min(1, 'Vui lòng chọn giống'),

  gender: z.enum(PET_GENDERS, {
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

  weight: z
    .string()
    .min(1, 'Vui lòng nhập cân nặng')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Cân nặng phải là số dương',
    }),

  color: z.string().min(1, 'Vui lòng nhập màu lông'),

  microchipId: z.string().optional(),

  isNeutered: z.boolean(),

  allergies: z.array(allergyItemSchema),

  medicalNotes: z.string().optional(),
});
