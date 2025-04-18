// src/features/payment/hooks/queries/get-payment-summary.ts

import API from '@/lib/axios-client';
import { useQuery } from '@tanstack/react-query';

// Type definitions for the payment summary response
export interface PaymentSummaryResponse {
  monthlyRevenue: number;
  previousMonthRevenue: number;
  weeklyRevenue: WeeklyRevenue[];
  paymentsByMethod: PaymentMethod[];
  statusCounts: StatusCounts;
  todayPayments: number;
}

export interface WeeklyRevenue {
  day: string;
  amount: number;
  count: number;
}

export interface PaymentMethod {
  name: string;
  value: number;
  amount: number;
}

export interface StatusCounts {
  pending: number;
  completed: number;
  failed: number;
  refunded: number;
}

// Thêm type cho dashboard statistics
export interface DashboardStatistics {
  currentMonth: {
    totalAppointments: number;
    completedAppointments: number;
    revenue: number;
  };
  previousMonth: {
    totalAppointments: number;
    completedAppointments: number;
    revenue: number;
  };
  changes: {
    appointmentsGrowth: number;
    completionRateChange: number;
    revenueGrowth: number;
  };
}

/**
 * Hook to fetch payment summary data
 */
export const useGetPaymentsSummary = () => {
  return useQuery<PaymentSummaryResponse>({
    queryKey: ['payments', 'summary'],
    queryFn: getPaymentsSummaryQueryFn,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * API query function for fetching payment summary
 */
export const getPaymentsSummaryQueryFn = async (): Promise<PaymentSummaryResponse> => {
  const { data } = await API.get('payments/summary');
  return data;
};

/**
 * Hook to fetch dashboard statistics
 */
export const useGetDashboardStatistics = () => {
  return useQuery<DashboardStatistics>({
    queryKey: ['dashboard', 'statistics'],
    queryFn: getDashboardStatisticsQueryFn,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

/**
 * API query function for fetching dashboard statistics
 */
export const getDashboardStatisticsQueryFn = async (): Promise<DashboardStatistics> => {
  const { data } = await API.get('reports/dashboard-statistics');
  return data.statistics;
};