import z from 'zod';

import {
  serviceCategorySchema,
  serviceDurationSchema,
  serviceNameSchema,
  servicePriceSchema,
  serviceSpecialtiesSchema,
} from '@/features/service/schemas/service-fields.schema';
import { imageFieldSchema } from '@/features/service/schemas/service-image.schema';
export const updateServiceSchema = z
  .object({
    name: serviceNameSchema.optional(),
    description: z.string().max(1000).optional(),

    price: servicePriceSchema.optional(),
    duration: serviceDurationSchema.optional(),

    category: serviceCategorySchema.optional(),

    requiredSpecialties: serviceSpecialtiesSchema.optional(),

    isActive: z.boolean().optional(),

    images: imageFieldSchema.optional(),
  })
  .refine(
    (data) => Object.entries(data).some(([_, value]) => value !== undefined && value !== null),
    {
      message: 'Cần thay đổi ít nhất một trường',
    },
  );

export type TUpdateServiceInput = z.infer<typeof updateServiceSchema>;
