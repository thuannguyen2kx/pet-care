import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import type { CreateBreakTemplateDto } from '@/features/employee-schedule/domain/schedule.dto';
import type { CreateBreakTemplate } from '@/features/employee-schedule/domain/schedule.state';
import { mapCreateBreakTemplateToDto } from '@/features/employee-schedule/domain/schedule.transform';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const createBreakTemplate = ({
  employeeId,
  createBreakTemplateDto,
}: {
  employeeId: string;
  createBreakTemplateDto: CreateBreakTemplateDto;
}) => {
  return http.post(EMPLOYEE_SCHEDULE_ENDPOINTS.CREATE_BREAK(employeeId), createBreakTemplateDto);
};

type UseCreateBreakTemplateOptions = {
  mutationConfig?: UseMutationOptions<unknown, unknown, CreateBreakTemplate, unknown>;
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
    mutationFn: (createBreakTemplateData: CreateBreakTemplate) => {
      const createBreakTemplateDto = mapCreateBreakTemplateToDto(createBreakTemplateData);
      return createBreakTemplate({
        employeeId: createBreakTemplateData.employeeId,
        createBreakTemplateDto,
      });
    },
  });
};
