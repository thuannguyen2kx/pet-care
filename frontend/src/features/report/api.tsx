import API from "@/lib/axios-client";
import { DashboardStatistics, IReport } from "./types/api.types";

// Define response types
export type ReportsResponse = {
  message: string;
  reports: IReport[];
  meta: {
    total: number;
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
};

export type ReportResponse = {
  message: string;
  report: IReport;
};

export type DashboardStatisticsResponse = {
  message: string;
  statistics: DashboardStatistics;
};

// Type for report filters
export interface ReportFilters {
  reportType?: "daily" | "weekly" | "monthly" | "yearly";
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

// Convert date objects to ISO strings for API requests
const formatDateParam = (date?: Date): string | undefined => {
  return date ? date.toISOString() : undefined;
};

// API functions
export const reportsApi = {
  // Get all reports with filtering
  getReports: async (filters: ReportFilters = {}): Promise<ReportsResponse> => {
    const { reportType, startDate, endDate, page = 1, limit = 10 } = filters;

    const params = new URLSearchParams();
    if (reportType) params.append("reportType", reportType);
    if (startDate) params.append("startDate", formatDateParam(startDate)!);
    if (endDate) params.append("endDate", formatDateParam(endDate)!);
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const response = await API.get<ReportsResponse>(
      `/reports?${params.toString()}`
    );
    return response.data;
  },

  // Get report by ID
  getReportById: async (reportId: string): Promise<ReportResponse> => {
    const response = await API.get<ReportResponse>(`/reports/${reportId}`);
    return response.data;
  },

  // Generate daily report
  generateDailyReport: async (date: Date): Promise<ReportResponse> => {
    const response = await API.post<ReportResponse>("/reports/daily", {
      date: date.toISOString(),
    });
    return response.data;
  },

  // Generate weekly report
  generateWeeklyReport: async (date: Date): Promise<ReportResponse> => {
    const response = await API.post<ReportResponse>("/reports/weekly", {
      date: date.toISOString(),
    });
    return response.data;
  },

  // Generate monthly report
  generateMonthlyReport: async (date: Date): Promise<ReportResponse> => {
    const response = await API.post<ReportResponse>("/reports/monthly", {
      date: date.toISOString(),
    });
    return response.data;
  },

  // Generate yearly report
  generateYearlyReport: async (date: Date): Promise<ReportResponse> => {
    const response = await API.post<ReportResponse>("/reports/yearly", {
      date: date.toISOString(),
    });
    return response.data;
  },

  // Get dashboard statistics
  getDashboardStatistics: async (): Promise<DashboardStatisticsResponse> => {
    const response = await API.get<DashboardStatisticsResponse>(
      "/reports/dashboard-statistics"
    );
    return response.data;
  },
};
