import { useMutation, useQueryClient } from '@tanstack/react-query';

import { serviceQueryKeys } from '@/features/service/api/query-keys';
import { SERVICE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const toggleServiceStatus = (serviceId: string) => {
  return http.patch(SERVICE_ENDPOINTS.TOGGLE_STATUS(serviceId));
};

type UseDeleteServiceOptions = {
  muationConfig?: MutationConfig<typeof toggleServiceStatus>;
};

export const useToggleServiceStatus = ({ muationConfig }: UseDeleteServiceOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = muationConfig ?? {};
  return useMutation({
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({ queryKey: serviceQueryKeys.admin.root() });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restConfig,
    mutationFn: toggleServiceStatus,
  });
};
