import { z } from 'zod';

import {
  EmployeeDashboardStartDtoSchema,
  EmployeeDtoSchema,
  EmployeeListItemDtoSchema,
} from '@/features/employee/domain/employee.dto';

export const employeeDashboardStatsResponseSchema = z.object({
  data: EmployeeDashboardStartDtoSchema,
});

export const EmployeeListResponseSchema = z.object({
  data: z.object({
    employees: z.array(EmployeeListItemDtoSchema),
    total: z.number(),
    pages: z.number(),
  }),
});

export const EmployeeDetailResponseSchema = z.object({
  data: z.object({
    user: EmployeeDtoSchema,
  }),
});
export const EmployeeProfileResponseSchema = z.object({
  data: z.object({
    user: EmployeeDtoSchema,
  }),
});
