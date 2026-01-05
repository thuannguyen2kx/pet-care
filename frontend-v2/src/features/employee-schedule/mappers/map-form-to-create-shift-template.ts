import { format } from 'date-fns';

import type {
  CreateShiftTemplateInput,
  CreateShiftTemplatePayload,
} from '@/features/employee-schedule/schemas';

export const mapFormToCreateShiftTemplate = (
  form: CreateShiftTemplateInput,
): CreateShiftTemplatePayload => {
  return {
    dayOfWeek: form.dayOfWeek,
    startTime: form.startTime,
    endTime: form.endTime,
    effectiveFrom: format(form.effectiveFrom, 'yyyy-MM-dd'),
    effectiveTo: form.effectiveTo ? format(form.effectiveTo, 'yyyy-MM-dd') : undefined,
  };
};
