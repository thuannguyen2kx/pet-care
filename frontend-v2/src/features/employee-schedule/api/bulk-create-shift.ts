import { useMutation, useQueryClient } from '@tanstack/react-query';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import type { BulkCreateShiftsPayload } from '@/features/employee-schedule/schemas';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';
import type { MutationConfig } from '@/shared/lib/react-query';

const bulkCreateShifts = (payload: BulkCreateShiftsPayload) => {
  return http.post(EMPLOYEE_SCHEDULE_ENDPOINTS.CREATE_SHIFT_BULK(payload.employeeId), payload);
};

type UseBulkCreateShiftsOptions = {
  mutationConfig?: MutationConfig<typeof bulkCreateShifts>;
};

export const useBulkCreateShifts = ({ mutationConfig }: UseBulkCreateShiftsOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: async (...args) => {
      queryClient.invalidateQueries({ queryKey: employeeScheduleKeys.schedule });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: bulkCreateShifts,
  });
};
