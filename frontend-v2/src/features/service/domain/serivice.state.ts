import { z } from 'zod';

import { EmployeeSpecialtySchema } from '@/features/employee/domain/employee.entity';
import { ServiceCategorySchema } from '@/features/service/domain/service.entity';

export const existingImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
});

export const newImageSchema = z.object({
  file: z.instanceof(File),
  previewUrl: z.string(),
});

export const imageFieldSchema = z.object({
  existing: z.array(existingImageSchema),
  added: z.array(newImageSchema),
});

export const serviceNameSchema = z
  .string()
  .trim()
  .min(3, 'Tên dịch vụ phải ít nhất 3 ký tự')
  .max(100);

export const ServicePriceSchema = z.number().positive().min(10_000).max(100_000_000);

export const ServiceDurationSchema = z.number().int().positive().min(15).max(10_080);

export const ServiceSpecialtiesSchema = z.array(EmployeeSpecialtySchema);

export const ServicesQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['all', 'active', 'inactive']).optional(),
  sort: z.enum(['updated_desc', 'price_asc', 'price_desc']).optional(),
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
});

export const CreateServiceSchema = z.object({
  name: serviceNameSchema,
  description: z.string().max(1000).optional(),

  price: ServicePriceSchema,
  duration: ServiceDurationSchema,

  category: ServiceCategorySchema,

  requiredSpecialties: ServiceSpecialtiesSchema.min(1, 'Phải chọn ít nhất một chuyên môn'),

  isActive: z.boolean().default(true),

  images: imageFieldSchema.refine((val) => val.existing.length + val.added.length > 0, {
    message: 'Phải có ít nhất 1 hình ảnh',
  }),
});

export const UpdateServiceSchema = z
  .object({
    name: serviceNameSchema.optional(),
    description: z.string().max(1000).optional(),

    price: ServicePriceSchema.optional(),
    duration: ServiceDurationSchema.optional(),

    category: ServiceCategorySchema.optional(),

    requiredSpecialties: ServiceSpecialtiesSchema.optional(),

    isActive: z.boolean().optional(),

    images: imageFieldSchema.optional(),
  })
  .refine(
    (data) => Object.entries(data).some(([_, value]) => value !== undefined && value !== null),
    {
      message: 'Cần thay đổi ít nhất một trường',
    },
  );

// ================
// Types
// ===============
export type ServicesQuery = z.infer<typeof ServicesQuerySchema>;
export type CreateService = z.infer<typeof CreateServiceSchema>;
export type UpdateService = z.infer<typeof UpdateServiceSchema>;
