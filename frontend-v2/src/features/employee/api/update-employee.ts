import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { employeeQueryKeys } from '@/features/employee/api/query-keys';
import type { UpdateEmployee } from '@/features/employee/domain/employee-state';
import type { UpdateEmployeeDto } from '@/features/employee/domain/employee.dto';
import { mapUpdateEmployeeToDto } from '@/features/employee/domain/employee.transform';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const updateEmployee = ({
  employeeId,
  updateEmployeeDto,
}: {
  employeeId: string;
  updateEmployeeDto: UpdateEmployeeDto;
}) => {
  return http.put(USER_ENDPOINTS.UPDATE_EMPLOYEE(employeeId), updateEmployeeDto);
};

type UseUpdateEmployeeOptions = {
  mutationConfig?: UseMutationOptions<unknown, unknown, UpdateEmployee, unknown>;
};

export const useUpdateEmployee = ({ mutationConfig }: UseUpdateEmployeeOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (_data, variables, ...args) => {
      queryClient.invalidateQueries({ queryKey: employeeQueryKeys.admin.lists() });
      queryClient.invalidateQueries({
        queryKey: employeeQueryKeys.admin.detail(variables.employeeId),
      });
      onSuccess?.(_data, variables, ...args);
    },
    ...restConfig,
    mutationFn: (updateEmployeeData: UpdateEmployee) => {
      const updateEmployeeDto = mapUpdateEmployeeToDto(updateEmployeeData);
      return updateEmployee({ employeeId: updateEmployeeData.employeeId, updateEmployeeDto });
    },
  });
};
