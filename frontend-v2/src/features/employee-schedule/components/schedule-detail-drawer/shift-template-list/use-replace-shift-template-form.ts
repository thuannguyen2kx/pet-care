import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';

import {
  replaceShiftTemplateInputSchema,
  type TReplaceShiftTemplateInput,
} from '@/features/employee-schedule/schemas';

type Props = {
  initialValues: {
    startTime: string;
    endTime: string;
  };
};
export const useReplaceShiftTemplateForm = ({ initialValues }: Props) => {
  const form = useForm<TReplaceShiftTemplateInput>({
    resolver: zodResolver(replaceShiftTemplateInputSchema) as Resolver<TReplaceShiftTemplateInput>,
    defaultValues: {
      startTime: initialValues.startTime,
      endTime: initialValues.endTime,
      effectiveFrom: new Date(),
    },
  });

  return { form };
};
