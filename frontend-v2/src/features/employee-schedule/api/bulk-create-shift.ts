import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import type { BuilkShiftsTemplateDto } from '@/features/employee-schedule/domain/schedule.dto';
import type { BulkCreateShiftsTemplate } from '@/features/employee-schedule/domain/schedule.state';
import { mapBulkShiftTemplatesToDto } from '@/features/employee-schedule/domain/schedule.transform';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const bulkCreateShifts = ({
  employeeId,
  builkCreateShiftsTemplateDto,
}: {
  employeeId: string;
  builkCreateShiftsTemplateDto: BuilkShiftsTemplateDto;
}) => {
  return http.post(
    EMPLOYEE_SCHEDULE_ENDPOINTS.CREATE_SHIFT_BULK(employeeId),
    builkCreateShiftsTemplateDto,
  );
};

type UseBulkCreateShiftsOptions = {
  mutationConfig?: UseMutationOptions<unknown, unknown, BulkCreateShiftsTemplate, unknown>;
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
    mutationFn: (builkShiftsTemplateData: BulkCreateShiftsTemplate) => {
      const bulkShiftsTemplateDto = mapBulkShiftTemplatesToDto(builkShiftsTemplateData);
      return bulkCreateShifts({
        employeeId: builkShiftsTemplateData.employeeId,
        builkCreateShiftsTemplateDto: bulkShiftsTemplateDto,
      });
    },
  });
};
