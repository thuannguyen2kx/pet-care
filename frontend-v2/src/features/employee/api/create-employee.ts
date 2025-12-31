import { useMutation, useQueryClient } from '@tanstack/react-query';

import { employeeKeys } from '@/features/employee/api/query-key';
import type { TCreateEmployeeInput } from '@/features/employee/shemas';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const createEmployee = (data: TCreateEmployeeInput) => {
  return http.post(USER_ENDPOINTS.CREATE_EMPLOYEE, data);
};

type UseCreateEmployeeOptions = {
  mutationConfig?: MutationConfig<typeof createEmployee>;
};

export const useCreateEmployee = ({ mutationConfig }: UseCreateEmployeeOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: createEmployee,
  });
};
