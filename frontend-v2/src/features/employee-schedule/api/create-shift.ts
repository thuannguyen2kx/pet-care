import { useMutation, useQueryClient } from '@tanstack/react-query';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import type { CreateShiftTemplatePayload } from '@/features/employee-schedule/schemas';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const createShiftTemplate = ({
  employeeId,
  payload,
}: {
  employeeId: string;
  payload: CreateShiftTemplatePayload;
}) => {
  return http.post(EMPLOYEE_SCHEDULE_ENDPOINTS.CREATE_SHIFT(employeeId), payload);
};

type UseCreateShiftTemplateOptions = {
  mutationConfig?: MutationConfig<typeof createShiftTemplate>;
};

export const useCreateShiftTemplate = ({ mutationConfig }: UseCreateShiftTemplateOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: employeeScheduleKeys.schedule });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createShiftTemplate,
  });
};
