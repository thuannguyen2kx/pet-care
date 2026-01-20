import z from 'zod';

import { EmployeeSpecialtyDtoSchema } from '@/features/employee/domain/employee.dto';
import { mongoObjectIdSchema } from '@/shared/lib/zod-primitives';

const ServiceCategoryDtoSchema = z.enum(['GROOMING', 'SPA', 'HEALTHCARE', 'TRAINING', 'BOARDING']);

// =================
// Response Dto
// =================
export const ServiceDtoSchema = z.object({
  _id: mongoObjectIdSchema,
  name: z.string(),
  description: z.string(),
  price: z.number(),
  duration: z.number(),
  category: ServiceCategoryDtoSchema,
  requiredSpecialties: z.array(EmployeeSpecialtyDtoSchema),
  images: z.array(
    z.object({
      url: z.string(),
      publicId: z.string(),
    }),
  ),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const ServicesPaginationDtoSchema = z.object({
  total: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  limit: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

// =================
// Request Dto
// =================
export type TServiceQueryPayload = {
  search?: string;
  category?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'price' | 'duration' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};
export const ServicesQueryDtoSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  sortBy: z.enum(['name', 'price', 'duration', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// =================
// Types
// =================
export type ServiceDto = z.infer<typeof ServiceDtoSchema>;
export type ServicesQueryDto = z.infer<typeof ServicesQueryDtoSchema>;
