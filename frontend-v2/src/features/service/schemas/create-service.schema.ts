import { z } from 'zod';

import {
  serviceCategorySchema,
  serviceDurationSchema,
  serviceNameSchema,
  servicePriceSchema,
  serviceSpecialtiesSchema,
} from '@/features/service/schemas/service-fields.schema';
import { imageFieldSchema } from '@/features/service/schemas/service-image.schema';

export const createServiceSchema = z.object({
  name: serviceNameSchema,
  description: z.string().max(1000).optional(),

  price: servicePriceSchema,
  duration: serviceDurationSchema,

  category: serviceCategorySchema,

  requiredSpecialties: serviceSpecialtiesSchema.min(1, 'Phải chọn ít nhất một chuyên môn'),

  isActive: z.boolean().default(true),

  images: imageFieldSchema.refine((val) => val.existing.length + val.added.length > 0, {
    message: 'Phải có ít nhất 1 hình ảnh',
  }),
});

// export const createServiceSchema = z
//   .object({
//     name: z
//       .string('Tên dịch vụ là bắt buộc')
//       .trim()
//       .min(3, 'Tên dịch vụ phải ít nhất 3 ký tự')
//       .max(100, 'Tên dịch vụ tối đa 100 ký tự')
//       .refine((val) => val.length > 0, 'Tên dịch vụ không được trống'),

//     description: z.string().trim().max(1000, 'Mổ tả dịch vụ tối đa 1000 ký tự').optional(),

//     price: z
//       .number('Giá dịch vụ là bắt buộc')
//       .positive('Giá dịch vụ phải là một số dương')
//       .min(10000, 'Giá dịch vụ phải ít nhất 10,000 VND')
//       .max(100000000, 'Giá không được vượt quá 100.000.000 VND'),

//     duration: z
//       .number('Thời lượng là bắt buộc')
//       .int('Thời lượng phải là một số nguyên')
//       .positive('Thời lượng phải là một số dương.')
//       .min(15, 'Thời lượng phải ít nhất 15 phút.')
//       .max(10080, 'Thời lượng không được vượt quá 1 tuần (10.080 phút).'),

//     category: z.enum(SPECIALTIES, {
//       message: 'Vui lòng chọn danh mục',
//     }),

//     requiredSpecialties: z
//       .array(z.enum(SPECIALTIES))
//       .default([])
//       .refine((val) => val.length > 0, {
//         message: 'Phải chọn ít nhất một chuyên môn',
//       }),

//     isActive: z.boolean().optional().default(true),
//     images: imageFieldSchema.refine((val) => val.existing.length + val.added.length > 0, {
//       message: 'Phải có ít nhất 1 hình ảnh',
//     }),
//   })
//   .strict();

export type TCreateServiceInput = z.infer<typeof createServiceSchema>;
