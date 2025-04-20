import { IServiceBreakdown, WeeklyDataPoint } from "../../types/api.types";

// Format currency in VND
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Colors for the charts
export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export const STATUS_COLORS = {
  completed: "#00C49F",
  pending: "#FFBB28",
  cancelled: "#FF8042",
  inProgress: "#0088FE",
};

// Period options for report filtering
export const PERIOD_OPTIONS = [
  { value: "day", label: "Hôm nay" },
  { value: "week", label: "Tuần này" },
  { value: "month", label: "Tháng này" },
  { value: "year", label: "Năm nay" },
  { value: "custom", label: "Tùy chỉnh" },
];

// Format date range for display
export const formatDateRange = (from?: Date, to?: Date): string => {
  if (!from || !to) return "Chọn khoảng thời gian";

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return `${formatDate(from)} - ${formatDate(to)}`;
};

// Convert API service breakdown to chart-friendly format
export const mapServiceBreakdownToChartData = (serviceBreakdown: IServiceBreakdown[] = []) => {
  return serviceBreakdown.map(service => ({
    name: service.serviceName,
    value: service.count,
    amount: service.revenue
  })).slice(0, 5); // Take top 5
};

// Convert API data to chart-friendly format for appointments by status
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapAppointmentStatusToChartData = (appointments: any = {}) => {
  return [
    {
      name: "Hoàn thành",
      value: appointments.completed || 0,
      color: STATUS_COLORS.completed,
    },
    {
      name: "Chờ xử lý",
      value: appointments.pending || 0,
      color: STATUS_COLORS.pending,
    },
    {
      name: "Đã hủy",
      value: appointments.cancelled || 0,
      color: STATUS_COLORS.cancelled,
    },
    {
      name: "Đang xử lý",
      value: appointments.inProgress || 0,
      color: STATUS_COLORS.inProgress,
    },
  ];
};

// Generate weekly revenue mock data - in real app would come from API
export const generateWeeklyRevenueData = () => {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return days.map((day) => ({
    day,
    amount: Math.floor(Math.random() * 2000000) + 1000000,
    count: Math.floor(Math.random() * 10) + 3,
  }));
};

// Generate monthly trend mock data - in real app would come from API
export const generateMonthlyTrendData = () => {
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return date.toLocaleDateString("vi-VN", { month: "short" });
  });

  return months.map((month) => ({
    month,
    revenue: Math.random() * 30000000 + 10000000,
    appointments: Math.floor(Math.random() * 100) + 50,
  }));
};

// Format weekly data for charts if needed
export const formatWeeklyData = (weeklyData: WeeklyDataPoint[] = []) => {
  // Đảm bảo có đủ 7 ngày trong tuần
  const dayOrder = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  
  // Sắp xếp lại dữ liệu theo thứ tự ngày trong tuần
  return dayOrder.map(day => {
    const found = weeklyData.find(item => item.day === day);
    return found || { day, count: 0, amount: 0 };
  });
};