import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  CreateShiftOverrideSchema,
  type CreateShiftOverride,
} from '@/features/employee-schedule/domain/schedule.state';

export const useCreateShiftOverrideForm = ({ employeeId }: { employeeId: string }) => {
  const form = useForm<CreateShiftOverride>({
    resolver: zodResolver(CreateShiftOverrideSchema),
    defaultValues: {
      employeeId,
      date: undefined,
      isWorking: false,
      startTime: '09:00',
      endTime: '17:00',
      reason: '',
    },
  });

  return { form };
};
