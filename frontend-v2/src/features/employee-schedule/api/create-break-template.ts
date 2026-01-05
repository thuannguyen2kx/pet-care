import { useMutation, useQueryClient } from '@tanstack/react-query';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import type { TCreateBreakTemplatePayload } from '@/features/employee-schedule/schemas';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const createBreakTemplate = ({
  employeeId,
  payload,
}: {
  employeeId: string;
  payload: TCreateBreakTemplatePayload;
}) => {
  return http.post(EMPLOYEE_SCHEDULE_ENDPOINTS.CREATE_BREAK(employeeId), payload);
};

type UseCreateBreakTemplateOptions = {
  mutationConfig?: MutationConfig<typeof createBreakTemplate>;
};

export const useCreateBreakTemplate = ({ mutationConfig }: UseCreateBreakTemplateOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: employeeScheduleKeys.schedule });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createBreakTemplate,
  });
};
