import { useMutation, useQueryClient } from '@tanstack/react-query';

import { userKeys } from '@/features/user/api/query-key';
import type { TProfile } from '@/features/user/types';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

export const removeAvatar = async (): Promise<TProfile> => {
  const response = await http.delete(USER_ENDPOINTS.REMOVE_PROFILE_IMAGE);
  return response.data.user;
};

type UseRemoveAvatarOptions = {
  mutationConfig?: MutationConfig<typeof removeAvatar>;
};

export const useRemoveAvatar = ({ mutationConfig }: UseRemoveAvatarOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    onSuccess: (data, ...args) => {
      queryClient.setQueriesData({ queryKey: userKeys.profile() }, data);
      onSuccess?.(data, ...args);
    },
    mutationFn: removeAvatar,
  });
};
