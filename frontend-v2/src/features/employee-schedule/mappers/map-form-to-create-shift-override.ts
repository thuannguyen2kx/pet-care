import { format } from 'date-fns';

import type {
  CreateShiftOverrideInput,
  CreateShiftOverridePayload,
} from '@/features/employee-schedule/schemas';

export function mapFormToCreateShiftOverridePayload(
  form: CreateShiftOverrideInput,
): CreateShiftOverridePayload {
  return {
    date: format(form.date, 'yyyy-MM-dd'),
    isWorking: form.isWorking,
    startTime: form.isWorking ? form.startTime : undefined,
    endTime: form.isWorking ? form.endTime : undefined,
    reason: form.reason,
  };
}
