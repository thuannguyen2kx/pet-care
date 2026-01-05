import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';

import {
  createShiftTemplateInputSchema,
  type CreateShiftTemplateInput,
} from '@/features/employee-schedule/schemas';

export const useCreateShiftTemplateForm = () => {
  const form = useForm<CreateShiftTemplateInput>({
    resolver: zodResolver(createShiftTemplateInputSchema) as Resolver<CreateShiftTemplateInput>,
    defaultValues: {
      dayOfWeek: 0,
      startTime: '',
      endTime: '',
      effectiveFrom: undefined,
      effectiveTo: undefined,
    },
  });

  return form;
};
