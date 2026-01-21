import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import type { DisableShiftTemplateDto } from '@/features/employee-schedule/domain/schedule.dto';
import type { DisableShiftTemplate } from '@/features/employee-schedule/domain/schedule.state';
import { mapDisableShiftTemplateToDto } from '@/features/employee-schedule/domain/schedule.transform';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const disableShiftTemplate = ({
  shiftId,
  disableShiftTemplateDto,
}: {
  shiftId: string;
  disableShiftTemplateDto: DisableShiftTemplateDto;
}) => {
  return http.put(EMPLOYEE_SCHEDULE_ENDPOINTS.DIABLE_SHIFT(shiftId), disableShiftTemplateDto);
};

type UseDisableShiftTemplate = {
  mutationConfig?: UseMutationOptions<unknown, unknown, DisableShiftTemplate, unknown>;
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
    mutationFn: (disableShiftTemplateData: DisableShiftTemplate) => {
      const disableShiftTemplateDto = mapDisableShiftTemplateToDto(disableShiftTemplateData);
      return disableShiftTemplate({
        shiftId: disableShiftTemplateData.shiftId,
        disableShiftTemplateDto,
      });
    },
  });
};
