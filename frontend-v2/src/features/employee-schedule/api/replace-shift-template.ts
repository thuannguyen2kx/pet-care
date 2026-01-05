import { useMutation, useQueryClient } from '@tanstack/react-query';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import type { TReplaceShiftTemplatePayload } from '@/features/employee-schedule/schemas';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const replaceShiftTemplate = ({
  shiftId,
  payload,
}: {
  shiftId: string;
  payload: TReplaceShiftTemplatePayload;
}) => {
  return http.put(EMPLOYEE_SCHEDULE_ENDPOINTS.REPLACE_SHIFT(shiftId), payload);
};

type UseReplaceShiftTemplateOptions = {
  mutationConfig?: MutationConfig<typeof replaceShiftTemplate>;
};

export const useReplaceShiftTemplate = ({
  mutationConfig,
}: UseReplaceShiftTemplateOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: employeeScheduleKeys.schedule });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: replaceShiftTemplate,
  });
};
