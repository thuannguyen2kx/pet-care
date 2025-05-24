/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-employee-schedule.ts
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import API from "@/lib/axios-client";
import { Schedule, Appointment } from "../types/schedule.types";
import { toast } from "sonner";

interface UseEmployeeScheduleReturn {
  schedules: Schedule[];
  appointments: Appointment[];
  isLoading: boolean;
  error: unknown;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  getScheduleForDate: (date: Date) => Schedule | null;
  saveSchedule: (data: any) => void;
  deleteSchedule: (scheduleId: string) => void;
  monthlyWorkingHours: number;
  monthlyAvailability: number;
  isSaving: boolean;
  isDeleting: boolean;
}

export const useEmployeeSchedule = (employeeId: string): UseEmployeeScheduleReturn => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const currentMonth = selectedDate ? new Date(selectedDate) : new Date();
  
  // Calculate date range for fetching
  const startDate = format(startOfMonth(currentMonth), "yyyy-MM-dd");
  const endDate = format(endOfMonth(currentMonth), "yyyy-MM-dd");
  
  // Fetch schedule data
  const { data, isLoading, error } = useQuery<{
    schedules: Schedule[];
    appointments: Appointment[];
  }>({
    queryKey: ["employeeSchedule", employeeId, startDate, endDate],
    queryFn: async () => {
      const response = await API.get(`/employees/${employeeId}/schedule-range`, {
        params: { startDate, endDate },
      });

      // Transform legacy data format to new format if needed
      // Todo: define a type for the response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const schedules = response.data.schedules.map((schedule: any) => {
        if (schedule.workHours && !Array.isArray(schedule.workHours)) {
          return {
            ...schedule,
            workHours: [
              {
                start: schedule.workHours.start,
                end: schedule.workHours.end,
              },
            ],
          };
        }
        return schedule;
      });

      return {
        ...response.data,
        schedules,
      };
    },
    enabled: !!employeeId && !!startDate && !!endDate,
  });

  // Save schedule mutation (handles both create and update)
  const saveScheduleMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (scheduleData: any) => {
      return API.post(`/employees/${employeeId}/schedule`, { schedules: [scheduleData] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeSchedule", employeeId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });

  // Delete schedule mutation
  const deleteScheduleMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      return API.delete(`/employees/${employeeId}/schedule/${scheduleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeeSchedule", employeeId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });

  // Function to get schedule for a specific date
  const getScheduleForDate = (date: Date): Schedule | null => {
    if (!data?.schedules) return null;
    
    const schedule = data.schedules.find((schedule) => {
      const scheduleDate = schedule.date instanceof Date
        ? schedule.date
        : new Date(schedule.date);
      return isSameDay(scheduleDate, date);
    });
    
    return schedule || null;
  };

  // Calculate monthly analytics
  const calculateMonthlyWorkingHours = (): number => {
    if (!data?.schedules) return 0;
    
    let totalHours = 0;
    data.schedules.forEach((schedule) => {
      if (schedule.isWorking && schedule.workHours) {
        schedule.workHours.forEach((range: { start: string; end: string }) => {
          const start = range.start.split(':').map(Number);
          const end = range.end.split(':').map(Number);
          
          const startHours = start[0] + start[1] / 60;
          const endHours = end[0] + end[1] / 60;
          
          totalHours += endHours - startHours;
        });
      }
    });
    
    return totalHours;
  };

  const calculateMonthlyAvailability = (): number => {
    if (!data?.schedules) return 0;
    
    const totalDaysInMonth = endOfMonth(currentMonth).getDate();
    const workingDays = data.schedules.filter(s => s.isWorking).length;
    
    return (workingDays / totalDaysInMonth) * 100;
  };

  // Return values and functions
  return {
    schedules: data?.schedules || [],
    appointments: data?.appointments || [],
    isLoading,
    error,
    selectedDate,
    setSelectedDate,
    getScheduleForDate,
    saveSchedule: saveScheduleMutation.mutate,
    deleteSchedule: deleteScheduleMutation.mutate,
    monthlyWorkingHours: calculateMonthlyWorkingHours(),
    monthlyAvailability: calculateMonthlyAvailability(),
    isSaving: saveScheduleMutation.isPending,
    isDeleting: deleteScheduleMutation.isPending,
  };
};