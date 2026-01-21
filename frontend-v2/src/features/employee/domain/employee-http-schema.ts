import { z } from 'zod';

import { EmployeeDashboardStartDtoSchema } from '@/features/employee/domain/employee.dto';

export const employeeDashboardStatsResponseSchema = z.object({
  data: EmployeeDashboardStartDtoSchema,
});
