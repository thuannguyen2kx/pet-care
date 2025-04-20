export interface IPeriod {
  start: Date;
  end: Date;
}

export interface IServiceBreakdown {
  serviceId: string;
  serviceName: string;
  count: number;
  revenue: number;
  completedCount: number;
  cancelledCount: number;
}

export interface IEmployeePerformance {
  employeeId: string;
  employeeName: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  revenue: number;
}

export interface IAppointmentStats {
  total: number;
  completed: number;
  cancelled: number;
  pending: number;
  confirmed: number;
  inProgress: number;
}

export interface IRevenueStats {
  total: number;
  avgPerAppointment: number;
}

export interface IPaymentStats {
  pending: number;
  completed: number;
  failed: number;
  refunded: number;
}

export interface ICustomerStats {
  total: number;
  new: number;
  recurring: number;
}

export interface IReportMetrics {
  period: IPeriod;
  appointments: IAppointmentStats;
  revenue: IRevenueStats;
  payments: IPaymentStats;
  serviceBreakdown: IServiceBreakdown[];
  employeePerformance: IEmployeePerformance[];
  customers: ICustomerStats;
}

export interface IReport {
  _id: string;
  reportType: "daily" | "weekly" | "monthly" | "yearly";
  period: IPeriod;
  metrics: IReportMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStatistics {
  currentMonth: {
    totalAppointments: number;
    completedAppointments: number;
    revenue: number;
    appointments: IAppointmentStats;
    serviceBreakdown: IServiceBreakdown[];
    employeePerformance: IEmployeePerformance[];
    customers: ICustomerStats;
    weeklyData: WeeklyDataPoint[];
    monthlyTrendData: MonthlyTrendPoint[];
    period: IPeriod;
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
export interface WeeklyDataPoint {
  day: string; // T2, T3, T4, etc.
  count: number;
  amount: number;
}
export interface MonthlyTrendPoint {
  month: string; // Th1, Th2, etc.
  revenue: number;
  appointments: number;
}
// Report filters type
export type ReportType = "daily" | "weekly" | "monthly" | "yearly";

export interface DateRange {
  from: Date | undefined;
  to?: Date;
}

export interface ReportDataPoint {
  name: string;
  value: number;
  amount?: number;
  color?: string;
}

// Type for the report data response
export interface ReportData {
  success: boolean;
  reportId: string;
}
