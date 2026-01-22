import { useMutation, useQueryClient } from '@tanstack/react-query';

import { employeeQueryKeys } from '@/features/employee/api/query-keys';
import type { EmployeeListItem } from '@/features/employee/domain/employee.entity';
import type { UserStatus } from '@/features/user/domain/user.entity';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const changeEmployeeStatus = ({
  employeeId,
  status,
}: {
  employeeId: string;
  status: UserStatus;
}) => {
  return http.patch(USER_ENDPOINTS.CHANGE_STATUS(employeeId), { status });
};

type UseChangeEmplyeeStatusOptions = {
  mutationConfig?: MutationConfig<typeof changeEmployeeStatus, ChangeEmployeeStatusContext>;
};
type ChangeEmployeeStatusContext = {
  previousQueries: [readonly unknown[], { employees: EmployeeListItem[] } | undefined][];
};
export const useChangeEmployeeStatus = ({ mutationConfig }: UseChangeEmplyeeStatusOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};
  return useMutation({
    async onMutate(variables) {
      await queryClient.cancelQueries({ queryKey: employeeQueryKeys.admin.lists() });

      const previousQueries = queryClient.getQueriesData<{
        employees: EmployeeListItem[];
      }>({
        queryKey: employeeQueryKeys.admin.lists(),
      });

      previousQueries.forEach(([queryKey, data]) => {
        if (!data) return;

        queryClient.setQueryData(queryKey, {
          ...data,
          employees: data.employees.map((emp) =>
            emp.id === variables.employeeId ? { ...emp, status: variables.status } : emp,
          ),
        });
      });

      return { previousQueries };
    },
    onError(error, _variables, context, ...arg) {
      context?.previousQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      onError?.(error, _variables, context, ...arg);
    },
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: changeEmployeeStatus,
  });
};
