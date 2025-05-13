// /features/employee/hooks/queries/get-employee-schedules.ts

import { useQuery } from '@tanstack/react-query';
import API from '@/lib/axios-client';
import { AppointmentType } from '@/features/appointment/types/api.types';

export interface WorkHours {
  start: string;
  end: string;
}

export interface EmployeeSchedule {
  _id?: string;
  date: string | Date;
  isWorking: boolean;
  workHours: WorkHours[];
  note?: string;
  isDefault?: boolean;
}

export interface EmployeeSchedulesResponse {
  schedules: EmployeeSchedule[];
  appointments: AppointmentType[];
}

const getEmployeeSchedules = async (
  employeeId: string,
  startDate: string,
  endDate: string
): Promise<EmployeeSchedulesResponse> => {
  const response = await API.get(`/employees/${employeeId}/schedule-range`, {
    params: { startDate, endDate },
  });
  return response.data;
};

export const useGetEmployeeSchedules = (
  employeeId: string | undefined,
  startDate: string,
  endDate: string,
  enabled = true
) => {
  return useQuery<EmployeeSchedulesResponse>({
    queryKey: ['employeeSchedules', employeeId, startDate, endDate],
    queryFn: () => {
      if (!employeeId) {
        throw new Error('Employee ID is required');
      }
      return getEmployeeSchedules(employeeId, startDate, endDate);
    },
    enabled: !!employeeId && enabled, // Only run the query if employeeId exists and enabled is true
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};