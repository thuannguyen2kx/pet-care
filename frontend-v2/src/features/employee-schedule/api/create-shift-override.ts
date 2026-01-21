import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { employeeScheduleKeys } from '@/features/employee-schedule/api/query-key';
import type { CreateShiftOverrideDto } from '@/features/employee-schedule/domain/schedule.dto';
import type { CreateShiftOverride } from '@/features/employee-schedule/domain/schedule.state';
import { mapCreateShiftOverrideToDto } from '@/features/employee-schedule/domain/schedule.transform';
import { EMPLOYEE_SCHEDULE_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const createShiftOverride = ({
  employeeId,
  createShiftOverrideDto,
}: {
  employeeId: string;
  createShiftOverrideDto: CreateShiftOverrideDto;
}) => {
  return http.post(EMPLOYEE_SCHEDULE_ENDPOINTS.CREATE_OVERRIDE(employeeId), createShiftOverrideDto);
};

type UseCreateShiftOverrideOptions = {
  mutationConfig?: UseMutationOptions<unknown, unknown, CreateShiftOverride, unknown>;
};

export const useCreateShiftOverride = ({ mutationConfig }: UseCreateShiftOverrideOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: employeeScheduleKeys.schedule });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: (createShiftOverrideData: CreateShiftOverride) => {
      const createShiftOverrideDto = mapCreateShiftOverrideToDto(createShiftOverrideData);
      return createShiftOverride({
        employeeId: createShiftOverrideData.employeeId,
        createShiftOverrideDto,
      });
    },
  });
};
