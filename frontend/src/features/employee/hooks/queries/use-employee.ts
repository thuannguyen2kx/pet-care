import API from '@/lib/axios-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

// Types
export interface EmployeeSpecialty {
  id: string;
  name: string;
}

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

export interface EmployeePerformanceData {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  upcomingAppointments: number;
  completionRate: number;
  cancellationRate: number;
  averageServiceDuration: number;
  rating: number;
  completedServices: number;
  busiestDay: {
    day: string;
    count: number;
  };
  totalRevenue: number;
  currentMonthRevenue: number;
  scheduleStats: {
    workingDays: number;
    totalDays: number;
    workingDaysPercentage: number;
    totalWorkingHours: number;
    averageHoursPerWorkingDay: number;
    appointmentsPerWorkingHour: number;
    utilizationRate: number;
  };
  serviceBreakdown: Record<string, { count: number; name: string }>;
  monthlyPerformance: Array<{
    year: number;
    month: number;
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    inProgress: number;
    revenue: number;
  }>;
  currentMonthStatusBreakdown: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    cancelled: number;
  };
  employeeDetails: {
    id: string;
    name: string;
    specialties: string[];
    profilePicture: string | null;
  };
}

export interface Employee {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  gender: string;
  role: string;
  profilePicture: {
    url: string | null;
    publicId: string | null;
  };
  status: string;
  employeeInfo: {
    specialties?: string[];
    schedule?: {
      workDays: string[];
      workHours: {
        start: string;
        end: string;
      };
      vacation?: { 
        start: Date; 
        end: Date 
      }[];
    };
    performance?: {
      rating: number;
      completedServices: number;
    };
  } | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEmployeePayload {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  status?: string;
  'employeeInfo.specialties'?: string[];
  'employeeInfo.schedule.workDays'?: string[];
  'employeeInfo.schedule.workHours'?: {
    start: string;
    end: string;
  };
}

// Hook to fetch employee data
export const useEmployee = (employeeId?: string) => {
  const { id } = useParams<{ id: string }>();
  const effectiveId = employeeId || id;
  const queryClient = useQueryClient();
  
  // Fetch employee details
  const {
    data: employee,
    isLoading: isEmployeeLoading,
    error: employeeError,
    refetch: refetchEmployee
  } = useQuery({
    queryKey: ['employee', effectiveId],
    queryFn: async () => {
      const { data } = await API.get(`/employees/${effectiveId}`);
      return data as Employee;
    },
    enabled: !!effectiveId,
  });

  // Fetch employee performance data
  const {
    data: performanceData,
    isLoading: isPerformanceLoading,
    error: performanceError,
    refetch: refetchPerformance
  } = useQuery({
    queryKey: ['employeePerformance', effectiveId],
    queryFn: async () => {
      const { data } = await API.get(`/employees/${effectiveId}/performance`);
      return data as EmployeePerformanceData;
    },
    enabled: !!effectiveId,
  });
  
  // Fetch employee specialties options
  const {
    data: specialties,
    isLoading: isSpecialtiesLoading
  } = useQuery({
    queryKey: ['employeeSpecialties'],
    queryFn: async () => {
      const { data } = await API.get('/specialties');
      return data as EmployeeSpecialty[];
    },
  });

  // Update employee mutation
  const updateEmployeeMutation = useMutation({
    mutationFn: async (employeeData: UpdateEmployeePayload) => {
      const { data } = await API.patch(
        `/api/employees/${effectiveId}`,
        employeeData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', effectiveId] });
    },
  });

  // Update employee rating mutation
  const updateEmployeeRatingMutation = useMutation({
    mutationFn: async (rating: number) => {
      const { data } = await API.patch(
        `/api/employees/${effectiveId}/performance`,
        { rating }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeePerformance', effectiveId] });
      queryClient.invalidateQueries({ queryKey: ['employee', effectiveId] });
    },
  });

  // Utility function to calculate average rating
  const calculateAverageRating = (employee: Employee | undefined) => {
    if (!employee?.employeeInfo?.performance?.rating) return 0;
    return employee.employeeInfo.performance.rating;
  };

  // Format work days to display format
  const formatWorkDays = (workDays: string[] | undefined) => {
    if (!workDays || workDays.length === 0) return 'No work days set';
    
    const dayNames = {
      'mon': 'Monday',
      'tue': 'Tuesday',
      'wed': 'Wednesday',
      'thu': 'Thursday',
      'fri': 'Friday',
      'sat': 'Saturday',
      'sun': 'Sunday'
    };
    
    return workDays.map(day => dayNames[day as keyof typeof dayNames] || day).join(', ');
  };

  return {
    employee,
    isEmployeeLoading,
    employeeError,
    refetchEmployee,
    
    performanceData,
    isPerformanceLoading,
    performanceError,
    refetchPerformance,
    
    specialties,
    isSpecialtiesLoading,
    
    updateEmployee: updateEmployeeMutation.mutate,
    isUpdatingEmployee: updateEmployeeMutation.isPending,
    
    updateEmployeeRating: updateEmployeeRatingMutation.mutate,
    isUpdatingRating: updateEmployeeRatingMutation.isPending,
    
    calculateAverageRating,
    formatWorkDays,
    
    // Combined loading states
    isLoading: isEmployeeLoading || isPerformanceLoading,
    // Combined error state
    hasError: !!employeeError || !!performanceError
  };
};

export default useEmployee;