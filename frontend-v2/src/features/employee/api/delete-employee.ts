import { useMutation, useQueryClient } from '@tanstack/react-query';

import { employeeKeys } from '@/features/employee/api/query-key';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const deleteEmployee = (employeeId: string) => {
  return http.delete(USER_ENDPOINTS.DELETE(employeeId));
};

type UseDeleteEmployeeOptions = {
  mutationConfig?: MutationConfig<typeof deleteEmployee>;
};

export const useDeleteEmployee = ({ mutationConfig }: UseDeleteEmployeeOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, variables, ...args) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      onSuccess?.(data, variables, ...args);
    },
    ...restConfig,
    mutationFn: deleteEmployee,
  });
};
