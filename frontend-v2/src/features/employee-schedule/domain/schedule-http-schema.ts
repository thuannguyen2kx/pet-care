import z from 'zod';

import { EmployeeDtoSchema } from '@/features/employee/domain/employee.dto';
import {
  BreakTemplateDtoSchema,
  EmployeeScheduleDtoSchema,
  EmployeeWeekScheduleDtoSchema,
  ShiftOverrideDtoSchmema,
  ShiftTemplateDtoSchema,
} from '@/features/employee-schedule/domain/schedule.dto';

export const EmployeWorkScheduleResponseSchema = z.object({
  data: z.array(EmployeeScheduleDtoSchema),
});

export const EmployeeWeekScheduleResponse = z.object({
  data: z.object({
    period: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
    employees: z.array(EmployeeWeekScheduleDtoSchema),
  }),
});

export const EmployeeScheduleDetailResponseSchema = z.object({
  data: z.object({
    employee: EmployeeDtoSchema,
    schedule: z.object({
      shifts: z.array(ShiftTemplateDtoSchema),
      breaks: z.array(BreakTemplateDtoSchema),
      overrides: z.array(ShiftOverrideDtoSchmema),
    }),
  }),
});
