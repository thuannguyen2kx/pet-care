import { useMutation, useQueryClient } from '@tanstack/react-query';

import { employeeKeys } from '@/features/employee/api/query-key';
import type { TEmployeeListItem } from '@/features/employee/types';
import type { TUserStatus } from '@/features/user/domain/user-status';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';
import type { TApiResponseSuccess } from '@/shared/types/api-response';

const changeEmployeeStatus = ({
  employeeId,
  status,
}: {
  employeeId: string;
  status: TUserStatus;
}): Promise<TApiResponseSuccess<TEmployeeListItem>> => {
  return http.patch(USER_ENDPOINTS.CHANGE_STATUS(employeeId), { status });
};

type UseChangeEmplyeeStatusOptions = {
  mutationConfig?: MutationConfig<typeof changeEmployeeStatus, ChangeEmployeeStatusContext>;
};
type ChangeEmployeeStatusContext = {
  previousQueries: [readonly unknown[], { employees: TEmployeeListItem[] } | undefined][];
};
export const useChangeEmployeeStatus = ({ mutationConfig }: UseChangeEmplyeeStatusOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...restConfig } = mutationConfig || {};
  return useMutation({
    async onMutate(variables) {
      await queryClient.cancelQueries({ queryKey: employeeKeys.lists() });

      const previousQueries = queryClient.getQueriesData<{
        employees: TEmployeeListItem[];
      }>({
        queryKey: employeeKeys.lists(),
      });

      previousQueries.forEach(([queryKey, data]) => {
        if (!data) return;

        queryClient.setQueryData(queryKey, {
          ...data,
          employees: data.employees.map((emp) =>
            emp._id === variables.employeeId ? { ...emp, status: variables.status } : emp,
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
