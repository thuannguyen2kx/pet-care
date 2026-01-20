import z from 'zod';

import { EmployeeSpecialtySchema } from '@/features/employee/domain/employee.entity';
import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

export const ServiceCategorySchema = z.enum([
  'GROOMING',
  'SPA',
  'HEALTHCARE',
  'TRAINING',
  'BOARDING',
]);

export const ServiceSchema = z.object({
  id: mongoObjectIdSchema,
  name: z.string(),
  description: z.string(),
  price: z.number(),
  duration: z.number(),
  category: ServiceCategorySchema,
  requiredSpecialties: z.array(EmployeeSpecialtySchema),
  images: z.array(
    z.object({
      url: z.string(),
      publicId: z.string(),
    }),
  ),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ======================
// Types
// ======================
export type Service = z.infer<typeof ServiceSchema>;
export type ServiceCategory = z.infer<typeof ServiceCategorySchema>;
// ======================
// Constant
// =====================
export const SERVICE_CATEGORIES = {
  GROOMING: 'GROOMING',
  SPA: 'SPA',
  HEALTHCARE: 'HEALTHCARE',
  TRAINING: 'TRAINING',
  BOARDING: 'BOARDING',
} as const;
