import { useMutation, useQueryClient } from '@tanstack/react-query';

import { serviceQueryKeys } from '@/features/service/api/query-keys';
import { SERVICE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const createService = (formData: FormData) => {
  return http.post(SERVICE_ENDPOINTS.CREATE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export type UseCreateServiceOptions = {
  mutationConfig?: MutationConfig<typeof createService>;
};

export const useCreateService = ({ mutationConfig }: UseCreateServiceOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: serviceQueryKeys.admin.lists() });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createService,
  });
};
