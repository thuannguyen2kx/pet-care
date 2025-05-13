// /features/employee/hooks/queries/get-employees-for-service.ts

import { useQuery } from '@tanstack/react-query';
import API from '@/lib/axios-client';
import { EmployeeType } from '@/features/employee/types/api.types';

interface EmployeesResponse {
  employees: EmployeeType[];
  message: string;
}

interface GetEmployeesParams {
  serviceId: string;
  serviceType: string;
}

const getEmployeesForService = async (params: GetEmployeesParams): Promise<EmployeesResponse> => {
  // Sử dụng endpoint có sẵn nhưng không truyền date và timeSlot
  const response = await API.get('/employees/available', {
    params: {
      serviceId: params.serviceId,
      serviceType: params.serviceType,
    },
  });
  return response.data;
};

export const useGetEmployeesForService = (params: GetEmployeesParams) => {
  return useQuery<EmployeesResponse>({
    queryKey: ['employeesForService', params.serviceId, params.serviceType],
    queryFn: () => getEmployeesForService(params),
    enabled: !!params.serviceId && !!params.serviceType,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};