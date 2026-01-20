import { useMutation, useQueryClient } from '@tanstack/react-query';

import { serviceQueryKeys } from '@/features/service/api/query-keys';
import { SERVICE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const updateService = ({ serviceId, formData }: { serviceId: string; formData: FormData }) => {
  return http.put(SERVICE_ENDPOINTS.UPDATE(serviceId), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export type UseUpdateServiceOptions = {
  mutationConfig?: MutationConfig<typeof updateService>;
};

export const useUpdateService = ({ mutationConfig }: UseUpdateServiceOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: serviceQueryKeys.admin.root() });
      queryClient.invalidateQueries({ queryKey: serviceQueryKeys.admin.detail(args[1].serviceId) });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateService,
  });
};
