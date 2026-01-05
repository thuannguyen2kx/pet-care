import { useMutation, useQueryClient } from '@tanstack/react-query';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import type { TDisableShiftTemplatePayload } from '@/features/employee-schedule/schemas';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const disableShiftTemplate = ({
  shiftId,
  payload,
}: {
  shiftId: string;
  payload: TDisableShiftTemplatePayload;
}) => {
  return http.put(EMPLOYEE_SCHEDULE_ENDPOINTS.DIABLE_SHIFT(shiftId), payload);
};

type UseDisableShiftTemplate = {
  mutationConfig?: MutationConfig<typeof disableShiftTemplate>;
};

export const useDisableShiftTemplate = ({ mutationConfig }: UseDisableShiftTemplate = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: employeeScheduleKeys.schedule });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: disableShiftTemplate,
  });
};
