import z from 'zod';

import {
  ServiceDtoSchema,
  ServicesPaginationDtoSchema,
} from '@/features/service/domain/service.dto';

export const GetServicesResponseSchema = z.object({
  data: z.object({
    services: z.array(ServiceDtoSchema),
    pagination: ServicesPaginationDtoSchema,
  }),
});

export const GetServiceDetailResponseSchema = z.object({
  data: z.object({
    service: ServiceDtoSchema,
  }),
});
