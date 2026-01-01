import { useMutation, useQueryClient } from '@tanstack/react-query';

import { employeeKeys } from '@/features/employee/api/query-key';
import type { TUpdateEmployeeInput } from '@/features/employee/shemas';
import { userKeys } from '@/features/user/api/query-key';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const updateEmployee = ({
  employeeId,
  data,
}: {
  employeeId: string;
  data: TUpdateEmployeeInput;
}) => {
  return http.put(USER_ENDPOINTS.UPDATE_EMPLOYEE(employeeId), data);
};

type UseUpdateEmployeeOptions = {
  mutationConfig?: MutationConfig<typeof updateEmployee>;
};

export const useUpdateEmployee = ({ mutationConfig }: UseUpdateEmployeeOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(args[1].employeeId) });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateEmployee,
  });
};
