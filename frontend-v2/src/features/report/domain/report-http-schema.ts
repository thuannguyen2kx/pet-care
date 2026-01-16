import z from 'zod';

import {
  AdminDashboardStatDtoSchema,
  TopEmployeeDtoSchema,
} from '@/features/report/domain/report.dto';

export const adminDashboardStatResponseSchema = z.object({
  data: AdminDashboardStatDtoSchema,
});

export const topEmployeeResponseSchema = z.object({
  data: z.array(TopEmployeeDtoSchema),
});
