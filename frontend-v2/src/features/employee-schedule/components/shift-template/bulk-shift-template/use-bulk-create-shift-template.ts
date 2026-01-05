import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';

import {
  bulkCreateShiftsInputSchema,
  type BulkCreateShiftsInput,
} from '@/features/employee-schedule/schemas';

export const useBulkCreateShiftTemplateForm = () => {
  const form = useForm<BulkCreateShiftsInput>({
    resolver: zodResolver(bulkCreateShiftsInputSchema) as Resolver<BulkCreateShiftsInput>,
    defaultValues: {
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
