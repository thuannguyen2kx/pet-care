import { useMutation, useQueryClient } from '@tanstack/react-query';

import { customerQueryKey } from '@/features/customer/api/query-keys';
import { employeeQueryKeys } from '@/features/employee/api/query-keys';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const updateProfileAvatar = (data: FormData) => {
  return http.put(USER_ENDPOINTS.UPDATE_PROFILE_IMAGE, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
type UseUpdateAvatarOptions = {
  mutaionConfig?: MutationConfig<typeof updateProfileAvatar>;
};

export const useUpdateAvatar = ({ mutaionConfig }: UseUpdateAvatarOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutaionConfig || {};
  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: employeeQueryKeys.employee.profile() });
      queryClient.invalidateQueries({ queryKey: customerQueryKey.profile() });

      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateProfileAvatar,
  });
};
