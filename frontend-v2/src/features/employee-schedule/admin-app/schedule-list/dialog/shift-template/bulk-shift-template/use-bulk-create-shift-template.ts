import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';

import {
  BulkCreateShiftsTemplateSchema,
  type BulkCreateShiftsTemplate,
} from '@/features/employee-schedule/domain/schedule.state';

export const useBulkCreateShiftTemplateForm = ({ employeeId }: { employeeId: string }) => {
  const form = useForm<BulkCreateShiftsTemplate>({
    resolver: zodResolver(BulkCreateShiftsTemplateSchema) as Resolver<BulkCreateShiftsTemplate>,
    defaultValues: {
      employeeId,
      days: {
        0: { isWorking: true, startTime: '09:00', endTime: '18:00' },
        1: { isWorking: true, startTime: '09:00', endTime: '18:00' },
        2: { isWorking: true, startTime: '09:00', endTime: '18:00' },
        3: { isWorking: true, startTime: '09:00', endTime: '18:00' },
        4: { isWorking: true, startTime: '09:00', endTime: '18:00' },
        5: { isWorking: false, startTime: '09:00', endTime: '18:00' },
        6: { isWorking: false, startTime: '09:00', endTime: '18:00' },
      },
      effectiveFrom: undefined,
      effectiveTo: undefined,
    },
  });

  return {
    form,
  };
};
