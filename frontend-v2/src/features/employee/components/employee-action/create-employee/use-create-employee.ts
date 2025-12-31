import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useCreateEmployee } from '@/features/employee/api/create-employee';
import { createEmployeeInputSchema, type TCreateEmployeeInput } from '@/features/employee/shemas';

type Props = {
  onSuccess?: () => void;
};
export const useCreateEmployeeForm = ({ onSuccess }: Props = {}) => {
  const form = useForm<TCreateEmployeeInput>({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      specialties: [],
      hourlyRate: 0,
      department: '',
    },
    resolver: zodResolver(createEmployeeInputSchema),
  });
  const createEmployee = useCreateEmployee({
    mutationConfig: {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    },
  });

  const submit = form.handleSubmit((data) => {
    createEmployee.mutate(data);
  });

  return {
    form,
    isSubmitting: createEmployee.isPending,
    submit,
  };
};
