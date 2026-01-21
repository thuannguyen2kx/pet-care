import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import type { ReplaceShiftTemplateDto } from '@/features/employee-schedule/domain/schedule.dto';
import type { ReplaceShiftTemplate } from '@/features/employee-schedule/domain/schedule.state';
import { mapReplaceShiftTemplateToDto } from '@/features/employee-schedule/domain/schedule.transform';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const replaceShiftTemplate = ({
  shiftId,
  replaceShiftTemplateDto,
}: {
  shiftId: string;
  replaceShiftTemplateDto: ReplaceShiftTemplateDto;
}) => {
  return http.put(EMPLOYEE_SCHEDULE_ENDPOINTS.REPLACE_SHIFT(shiftId), replaceShiftTemplateDto);
};

type UseReplaceShiftTemplateOptions = {
  mutationConfig?: UseMutationOptions<unknown, unknown, ReplaceShiftTemplate, unknown>;
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
    mutationFn: (replaceShiftTemplateData: ReplaceShiftTemplate) => {
      const replaceShiftTemplateDto = mapReplaceShiftTemplateToDto(replaceShiftTemplateData);
      return replaceShiftTemplate({
        shiftId: replaceShiftTemplateData.shiftId,
        replaceShiftTemplateDto,
      });
    },
  });
};
