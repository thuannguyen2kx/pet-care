// /features/appointment/hooks/queries/get-available-time-slot.ts

import { useQuery } from '@tanstack/react-query';
import API from '@/lib/axios-client';
import { format } from 'date-fns';

export interface EmployeeAvailability {
  employeeId: string;
  isAvailable: boolean;
  appointmentId?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  employeeAvailability: EmployeeAvailability[];
  originalSlotIndexes?: number[];
}

export interface WorkHours {
  start: string;
  end: string;
}

export interface TimeSlotData {
  date: Date;
  slots: TimeSlot[];
  // Các trường mới được thêm vào
  employeeNotWorking?: boolean;
  employeeOnVacation?: boolean;
  noAvailableSlots?: boolean;
  employeeWorkHours?: WorkHours[];
}

export interface TimeSlotResponse {
  timeSlot: TimeSlotData;
}

const getAvailableTimeSlots = async (
  date: Date | undefined,
  serviceId: string,
  serviceType: string,
  employeeId?: string // Thêm tham số employeeId
): Promise<TimeSlotResponse> => {
  if (!date) {
    throw new Error('Date is required');
  }

  const formattedDate = format(date, 'yyyy-MM-dd');

  // Xây dựng params với employeeId (nếu có)
  const params: { date: string; serviceId: string; serviceType: string; employeeId?: string } = {
    date: formattedDate,
    serviceId,
    serviceType,
  };

  if (employeeId) {
    params.employeeId = employeeId;
  }

  const response = await API.get('/appointments/time-slots', { params });
  return response.data;
};

export const useGetAvailableTimeSlots = (
  date: Date | undefined,
  serviceId: string,
  serviceType: string,
  employeeId?: string // Thêm tham số employeeId
) => {
  return useQuery<TimeSlotResponse>({
    queryKey: ['availableTimeSlots', date?.toISOString(), serviceId, serviceType, employeeId],
    queryFn: () => getAvailableTimeSlots(date, serviceId, serviceType, employeeId),
    enabled: !!date && !!serviceId && !!serviceType, // Chỉ chạy khi có đủ thông tin
    refetchOnWindowFocus: false,
  });
};