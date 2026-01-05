import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  createShiftOverrideInputSchema,
  type CreateShiftOverrideInput,
} from '@/features/employee-schedule/schemas';

export const useCreateShiftOverrideForm = () => {
  const form = useForm<CreateShiftOverrideInput>({
    resolver: zodResolver(createShiftOverrideInputSchema),
    defaultValues: {
      date: undefined,
      isWorking: false,
      startTime: '09:00',
      endTime: '17:00',
      reason: '',
    },
  });

  return { form };
};
