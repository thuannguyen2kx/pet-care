import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';

import {
  CreateShiftTemplateSchema,
  type CreateShiftTemplate,
} from '@/features/employee-schedule/domain/schedule.state';

export const useCreateShiftTemplateForm = ({ employeeId }: { employeeId: string }) => {
  const form = useForm<CreateShiftTemplate>({
    resolver: zodResolver(CreateShiftTemplateSchema) as Resolver<CreateShiftTemplate>,
    defaultValues: {
      employeeId,
      dayOfWeek: 0,
      startTime: '',
      endTime: '',
      effectiveFrom: undefined,
      effectiveTo: undefined,
    },
  });

  return form;
};
