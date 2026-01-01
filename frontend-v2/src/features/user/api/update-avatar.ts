import { useMutation, useQueryClient } from '@tanstack/react-query';

import { userKeys } from '@/features/user/api/query-key';
import type { TProfile } from '@/features/user/types';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const updateProfileAvatar = async (data: FormData): Promise<TProfile> => {
  const res = await http.put(USER_ENDPOINTS.UPDATE_PROFILE_IMAGE, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data.user;
};
type UseUpdateAvatarOptions = {
  mutaionConfig?: MutationConfig<typeof updateProfileAvatar>;
};

export const useUpdateAvatar = ({ mutaionConfig }: UseUpdateAvatarOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutaionConfig || {};
  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.setQueriesData({ queryKey: userKeys.profile() }, data);

      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateProfileAvatar,
  });
};
