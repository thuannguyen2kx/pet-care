import { useMutation, useQueryClient } from '@tanstack/react-query';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import type { CreateShiftOverridePayload } from '@/features/employee-schedule/schemas';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const createShiftOverride = ({
  employeeId,
  payload,
}: {
  employeeId: string;
  payload: CreateShiftOverridePayload;
}) => {
  return http.post(EMPLOYEE_SCHEDULE_ENDPOINTS.CREATE_OVERRIDE(employeeId), payload);
};

type UseCreateShiftOverrideOptions = {
  mutationConfig?: MutationConfig<typeof createShiftOverride>;
};

export const useCreateShiftOverride = ({ mutationConfig }: UseCreateShiftOverrideOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: employeeScheduleKeys.schedule });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createShiftOverride,
  });
};
