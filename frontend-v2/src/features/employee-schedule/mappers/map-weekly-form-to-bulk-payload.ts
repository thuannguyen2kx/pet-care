import { format } from 'date-fns';

import type {
  BulkCreateShiftsInput,
  BulkCreateShiftsPayload,
} from '@/features/employee-schedule/schemas';

export function mapWeeklyFormToBulkPayload(
  employeeId: string,
  form: BulkCreateShiftsInput,
): BulkCreateShiftsPayload {
  return {
    employeeId,

    shifts: Object.entries(form.days)
      .filter(([, v]) => v.isWorking)
      .map(([day, v]) => ({
        dayOfWeek: Number(day),
        startTime: v.startTime!,
        endTime: v.endTime!,
      })),

    effectiveFrom: format(form.effectiveFrom, 'yyyy-MM-dd'),
    effectiveTo: form.effectiveTo ? format(form.effectiveTo, 'yyyy-MM-dd') : undefined,
  };
}
