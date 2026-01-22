import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';

import { useCreateEmployee } from '@/features/employee/api/create-employee';
import {
  CreateEmployeeSchema,
  type CreateEmployee,
} from '@/features/employee/domain/employee-state';

type Props = {
  onSuccess?: () => void;
};
export const useCreateEmployeeForm = ({ onSuccess }: Props = {}) => {
  const form = useForm<CreateEmployee>({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      specialties: [],
      hourlyRate: 0,
      department: '',
    },
    resolver: zodResolver(CreateEmployeeSchema) as Resolver<CreateEmployee>,
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
