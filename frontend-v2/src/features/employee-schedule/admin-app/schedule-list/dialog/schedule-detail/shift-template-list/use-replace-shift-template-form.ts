import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';

import {
  ReplaceShiftTemplateSchema,
  type ReplaceShiftTemplate,
} from '@/features/employee-schedule/domain/schedule.state';

type Props = {
  initialValues: {
    shiftId: string;
    startTime: string;
    endTime: string;
  };
};
export const useReplaceShiftTemplateForm = ({ initialValues }: Props) => {
  const form = useForm<ReplaceShiftTemplate>({
    resolver: zodResolver(ReplaceShiftTemplateSchema) as Resolver<ReplaceShiftTemplate>,
    defaultValues: {
      shiftId: initialValues.shiftId,
      startTime: initialValues.startTime,
      endTime: initialValues.endTime,
      effectiveFrom: new Date(),
    },
  });

  return { form };
};
