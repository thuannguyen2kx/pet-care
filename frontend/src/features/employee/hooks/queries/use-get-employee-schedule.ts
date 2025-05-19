import API from '@/lib/axios-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// Types
export interface TimeRange {
  start: string; // HH:MM format
  end: string; // HH:MM format
}

export interface EmployeeSchedule {
  _id: string;
  employeeId: string;
  date: string;
  isWorking: boolean;
  workHours: TimeRange[];
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleUpdatePayload {
  date: string;
  isWorking: boolean;
  workHours: TimeRange[];
  note?: string;
}

// Hook for fetching employee schedules
export const useEmployeeSchedule = (employeeId: string, month?: number, year?: number) => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get current month and year if not provided
  const now = new Date();
  const currentMonth = month || now.getMonth() + 1;
  const currentYear = year || now.getFullYear();

  // Format date range for the API
  const startDate = new Date(currentYear, currentMonth - 1, 1);
  const endDate = new Date(currentYear, currentMonth, 0);
  
  // Fetch schedule data for a month
  const { data, isLoading, error } = useQuery({
    queryKey: ['employeeSchedule', employeeId, currentYear, currentMonth],
    queryFn: async () => {
      const { data } = await API.get(
        `/employees/${employeeId}/schedule-range`, {
          params: {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
          }
        }
      );
      return data.schedules as EmployeeSchedule[];
    },
    enabled: !!employeeId
  });

  // Create schedule mutation
  const createScheduleMutation = useMutation({
    mutationFn: async (scheduleData: ScheduleUpdatePayload) => {
      const { data } = await API.post(
        `/employees/${employeeId}/schedules`,
        scheduleData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeSchedule', employeeId] });
    }
  });

  // Update schedule mutation
  const updateScheduleMutation = useMutation({
    mutationFn: async ({ scheduleId, data }: { scheduleId: string; data: ScheduleUpdatePayload }) => {
      const response = await API.put(
        `/employees/${employeeId}/schedules/${scheduleId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeSchedule', employeeId] });
    }
  });

  // Delete schedule mutation
  const deleteScheduleMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      const response = await API.delete(
        `/employees/${employeeId}/schedules/${scheduleId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeSchedule', employeeId] });
    }
  });

  // Get schedule for a specific date
  const getScheduleForDate = (date: Date) => {
    if (!data) return null;
    
    const dateString = date.toISOString().split('T')[0];
    return data.find(schedule => {
      const scheduleDate = new Date(schedule.date).toISOString().split('T')[0];
      return scheduleDate === dateString;
    });
  };

  // Utility function to check if an employee is available at a specific time
  const isEmployeeAvailable = (date: Date, timeSlot: TimeRange) => {
    const schedule = getScheduleForDate(date);
    
    // If no schedule or not working, employee is unavailable
    if (!schedule || !schedule.isWorking) return false;
    
    // Check if the requested time slot falls within any of the work hours
    return schedule.workHours.some(workHour => {
      return timeSlot.start >= workHour.start && timeSlot.end <= workHour.end;
    });
  };

  // Calculate availability percentage for the month
  const calculateMonthlyAvailability = () => {
    if (!data) return 0;
    
    const workingDays = data.filter(schedule => schedule.isWorking).length;
    const totalDays = endDate.getDate(); // Number of days in the month
    
    return (workingDays / totalDays) * 100;
  };

  // Get total working hours for the month
const calculateMonthlyWorkingHours = () => {
  if (!Array.isArray(data) || data.length === 0) return 0;

  return data.reduce((total, schedule) => {
    // Bỏ qua ca không làm việc
    if (!schedule?.isWorking || !schedule?.workHours) return total;

    // Ép workHours thành mảng để xử lý chung cho cả object lẫn mảng
    const ranges = Array.isArray(schedule.workHours)
      ? schedule.workHours
      : [schedule.workHours];

    // Tính số giờ của từng ca trong ngày
    const hoursForDay = ranges.reduce((dayTotal, { start, end }) => {
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      const minutes = (eh * 60 + em) - (sh * 60 + sm);
      return dayTotal + minutes / 60;
    }, 0);

    return total + hoursForDay;
  }, 0);
};

  return {
    schedules: data || [],
    isLoading,
    error,
    selectedDate,
    setSelectedDate,
    getScheduleForDate,
    isEmployeeAvailable,
    createSchedule: createScheduleMutation.mutate,
    updateSchedule: updateScheduleMutation.mutate,
    deleteSchedule: deleteScheduleMutation.mutate,
    monthlyAvailability: calculateMonthlyAvailability(),
    monthlyWorkingHours: calculateMonthlyWorkingHours(),
    currentMonth,
    currentYear,
  };
};