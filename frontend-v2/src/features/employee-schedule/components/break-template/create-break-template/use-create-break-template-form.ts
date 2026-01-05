import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';

import {
  createBreakTemplateInputSchema,
  type TCreateBreakTemplateInput,
} from '@/features/employee-schedule/schemas';

export const useCreateBreakTemplateForm = () => {
  const form = useForm<TCreateBreakTemplateInput>({
    resolver: zodResolver(createBreakTemplateInputSchema) as Resolver<TCreateBreakTemplateInput>,
    defaultValues: {
      name: '',
      dayOfWeek: undefined,
      startTime: '12:00',
      endTime: '13:00',
      effectiveFrom: undefined,
      effectiveTo: undefined,
      breakType: 'WEEKLY',
    },
  });

  return { form };
};
