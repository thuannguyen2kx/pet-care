import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { employeeKeys } from '@/features/employee/api/query-key';
import type { CreateEmployee } from '@/features/employee/domain/employee-state';
import type { CreateEmployeeDto } from '@/features/employee/domain/employee.dto';
import { mapCreatEmployeeToDto } from '@/features/employee/domain/employee.transform';
import { USER_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

const createEmployee = (createEmployeeDto: CreateEmployeeDto) => {
  return http.post(USER_ENDPOINTS.CREATE_EMPLOYEE, createEmployeeDto);
};

type UseCreateEmployeeOptions = {
  mutationConfig?: UseMutationOptions<unknown, unknown, CreateEmployee, unknown>;
};

export const useCreateEmployee = ({ mutationConfig }: UseCreateEmployeeOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.admin.lists() });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: (createEmployeeData: CreateEmployee) => {
      const createEmployeeDto = mapCreatEmployeeToDto(createEmployeeData);
      return createEmployee(createEmployeeDto);
    },
  });
};
