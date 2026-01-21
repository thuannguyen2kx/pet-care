import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import type { CreateShiftTemplateDto } from '@/features/employee-schedule/domain/schedule.dto';
import type { CreateShiftTemplate } from '@/features/employee-schedule/domain/schedule.state';
import { mapCreateShiftTemplateToDto } from '@/features/employee-schedule/domain/schedule.transform';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const createShiftTemplate = ({
  employeeId,
  createShiftTemplateDto,
}: {
  employeeId: string;
  createShiftTemplateDto: CreateShiftTemplateDto;
}) => {
  return http.post(EMPLOYEE_SCHEDULE_ENDPOINTS.CREATE_SHIFT(employeeId), createShiftTemplateDto);
};

type UseCreateShiftTemplateOptions = {
  mutationConfig?: UseMutationOptions<unknown, unknown, CreateShiftTemplate, unknown>;
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
    mutationFn: (createShiftTemplateData: CreateShiftTemplate) => {
      const createShiftTemplateDto = mapCreateShiftTemplateToDto(createShiftTemplateData);
      return createShiftTemplate({
        employeeId: createShiftTemplateData.employeeId,
        createShiftTemplateDto,
      });
    },
  });
};
