import { z } from 'zod';

import {
  EmployeeDashboardStartDtoSchema,
  EmployeeScheduleDtoSchema,
} from '@/features/employee/domain/employee.dto';

export const employeeDashboardStatsResponseSchema = z.object({
  data: EmployeeDashboardStartDtoSchema,
});

export const employeWorkScheduleResponseSchema = z.object({
  data: z.array(EmployeeScheduleDtoSchema),
});
