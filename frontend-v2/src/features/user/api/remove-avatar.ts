import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { customerQueryKey } from '@/features/customer/api/query-keys';
import { employeeQueryKeys } from '@/features/employee/api/query-keys';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

export const removeAvatar = async () => {
  const response = await http.delete(USER_ENDPOINTS.REMOVE_PROFILE_IMAGE);
  return response.data.user;
};

type UseRemoveAvatarOptions = {
  mutationConfig?: UseMutationOptions<unknown, unknown, void, unknown>;
};

export const useRemoveAvatar = ({ mutationConfig }: UseRemoveAvatarOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: employeeQueryKeys.employee.profile() });
      queryClient.invalidateQueries({ queryKey: customerQueryKey.profile() });
      onSuccess?.(data, ...args);
    },
    mutationFn: removeAvatar,
  });
};
