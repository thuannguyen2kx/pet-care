import { z } from 'zod';

import { SPECIALTIES } from '@/features/service/constants';

export const serviceNameSchema = z
  .string()
  .trim()
  .min(3, 'Tên dịch vụ phải ít nhất 3 ký tự')
  .max(100);

export const servicePriceSchema = z.number().positive().min(10_000).max(100_000_000);

export const serviceDurationSchema = z.number().int().positive().min(15).max(10_080);

export const serviceCategorySchema = z.enum(SPECIALTIES);

export const serviceSpecialtiesSchema = z.array(serviceCategorySchema);
