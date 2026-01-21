import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';

import {
  CreateBreakTemplateSchema,
  type CreateBreakTemplate,
} from '@/features/employee-schedule/domain/schedule.state';

export const useCreateBreakTemplateForm = ({ employeeId }: { employeeId: string }) => {
  const form = useForm<CreateBreakTemplate>({
    resolver: zodResolver(CreateBreakTemplateSchema) as Resolver<CreateBreakTemplate>,
    defaultValues: {
      employeeId,
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
