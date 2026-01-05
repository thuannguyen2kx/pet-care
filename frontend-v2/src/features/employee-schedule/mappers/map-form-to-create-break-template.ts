import { format } from 'date-fns';

import type {
  TCreateBreakTemplateInput,
  TCreateBreakTemplatePayload,
} from '@/features/employee-schedule/schemas';

export const mapFormToCreateBreakTemplatePayload = (
  form: TCreateBreakTemplateInput,
): TCreateBreakTemplatePayload => {
  const base = {
    name: form.name,
    startTime: form.startTime,
    endTime: form.endTime,
    effectiveFrom: format(form.effectiveFrom, 'yyyy-MM-dd'),
    effectiveTo: form.effectiveTo ? format(form.effectiveTo, 'yyyy-MM-dd') : undefined,
  };

  if (form.breakType === 'WEEKLY') {
    return {
      ...base,
      dayOfWeek: form.dayOfWeek,
    };
  }

  return base;
};
