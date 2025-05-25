import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Calendar,
  Clock,
  DollarSign,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  Users,
  Star,
  AlertCircle,
} from "lucide-react";
import API from "@/lib/axios-client";
import { useAuthContext } from "@/context/auth-provider";
import { weekdays } from "@/constants";

interface MonthlyPerformance {
  year: number;
  month: number;
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
  inProgress: number;
  revenue: number;
}

interface ServiceBreakdown {
  [key: string]: {
    count: number;
    name: string;
  };
}

interface StatusBreakdown {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  cancelled: number;
}

interface EmployeePerformance {
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
  serviceBreakdown: ServiceBreakdown;
  monthlyPerformance: MonthlyPerformance[];
  currentMonthStatusBreakdown: StatusBreakdown;
  scheduleStats?: {
    workingDays: number;
    totalDays: number;
    workingDaysPercentage: number;
    totalWorkingHours: number;
    averageHoursPerWorkingDay: number;
    appointmentsPerWorkingHour: number;
    utilizationRate: number;
  };
  employeeDetails: {
    id: string;
    name: string;
    specialties: string[];
    profilePicture: string | null;
  };
}

// Custom hook để lấy dữ liệu hiệu suất nhân viên
const useEmployeePerformance = (employeeId: string) => {
  return useQuery({
    queryKey: ["employeePerformance", employeeId],
    queryFn: async () => {
      const { data } = await API.get(`/employees/${employeeId}/performance`);
      return data as EmployeePerformance;
    },
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// Định dạng tên tháng
const getMonthName = (month: number) => {
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  return monthNames[month - 1];
};

// Định dạng tiền tệ
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

// Tooltip tùy chỉnh cho biểu đồ
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-md text-sm">
        <p className="text-gray-700 font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={`item-${index}`}
            style={{ color: entry.color }}
            className="my-1"
          >
            {`${entry.name}: ${
              typeof entry.value === "number" && entry.dataKey === "revenue"
                ? formatCurrency(entry.value)
                : entry.value
            }`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Component cho thẻ thống kê tóm tắt
const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ElementType;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-gray-400" />}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <CardDescription>{description}</CardDescription>}
    </CardContent>
  </Card>
);

// Component dashboard chính
const EmployeePerformanceDashboard = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { user } = useAuthContext();
  const { data, error, isLoading } = useEmployeePerformance(
    employeeId || user?._id || ""
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>
          Không thể tải dữ liệu hiệu suất nhân viên. Vui lòng thử lại sau.
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  // Chuẩn bị dữ liệu biểu đồ
  const monthlyData = data.monthlyPerformance.map((item) => ({
    name: `${getMonthName(item.month)} ${item.year}`,
    total: item.total,
    completed: item.completed,
    cancelled: item.cancelled,
    pending: item.pending,
    inProgress: item.inProgress,
    revenue: item.revenue,
  }));

  // Chuẩn bị dữ liệu biểu đồ tròn cho phân tích dịch vụ
  const pieData = Object.entries(data.serviceBreakdown).map(([, service]) => ({
    name: service.name,
    value: service.count,
  }));

  // Chuẩn bị dữ liệu phân tích trạng thái
  const statusData = [
    {
      name: "Đã hoàn thành",
      value: data.currentMonthStatusBreakdown.completed,
      color: "#10b981",
    },
    {
      name: "Đang chờ",
      value: data.currentMonthStatusBreakdown.pending,
      color: "#f59e0b",
    },
    {
      name: "Đang xử lý",
      value: data.currentMonthStatusBreakdown.inProgress,
      color: "#3b82f6",
    },
    {
      name: "Đã hủy",
      value: data.currentMonthStatusBreakdown.cancelled,
      color: "#ef4444",
    },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  // Tính toán dữ liệu xu hướng
  const calculateTrend = (dataKey: keyof MonthlyPerformance) => {
    if (data.monthlyPerformance.length < 2)
      return { value: 0, isIncreasing: true };

    const lastTwoMonths = data.monthlyPerformance.slice(-2);
    const previousMonth = lastTwoMonths[0][dataKey] || 0;
    const currentMonth = lastTwoMonths[1][dataKey] || 0;

    if (previousMonth === 0) return { value: 100, isIncreasing: true };

    const percentChange =
      ((currentMonth - previousMonth) / previousMonth) * 100;
    return {
      value: Math.abs(Math.round(percentChange)),
      isIncreasing: percentChange >= 0,
    };
  };

  const appointmentsTrend = calculateTrend("total");
  const revenueTrend = calculateTrend("revenue");
  const completionTrend = calculateTrend("completed");

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Tiêu đề nhân viên */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Hiệu suất nhân viên</h2>
        <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">
              {data.rating.toFixed(1)}
            </span>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(data.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <span className="text-sm text-gray-500">
            {data.completedServices} dịch vụ đã hoàn thành
          </span>
        </div>
      </div>

      {/* Tổng quan thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tỷ lệ hoàn thành"
          value={`${data.completionRate}%`}
          description="Lịch hẹn hoàn thành thành công"
          icon={Activity}
        />

        <StatCard
          title="Ngày bận nhất"
          value={
            weekdays.find((w) => w.id === data.busiestDay.day.toLowerCase())
              ?.label || ""
          }
          description={`${data.busiestDay.count} lịch hẹn`}
          icon={Calendar}
        />

        <StatCard
          title="Thời gian dịch vụ TB"
          value={`${data.averageServiceDuration} phút`}
          icon={Clock}
        />
        <StatCard
          title="Doanh thu tháng"
          value={formatCurrency(data.currentMonthRevenue)}
          icon={DollarSign}
        />
      </div>

      {/* Tóm tắt xu hướng theo tháng */}
      <Card>
        <CardHeader>
          <CardTitle>Xu hướng hiệu suất theo tháng</CardTitle>
          <CardDescription>Thay đổi so với tháng trước</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`rounded-full p-3 ${
                  appointmentsTrend.isIncreasing ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {appointmentsTrend.isIncreasing ? (
                  <ChevronUpIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Lịch hẹn</p>
                <p
                  className={`text-xl font-semibold ${
                    appointmentsTrend.isIncreasing
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {appointmentsTrend.isIncreasing ? "+" : "-"}
                  {appointmentsTrend.value}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`rounded-full p-3 ${
                  revenueTrend.isIncreasing ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {revenueTrend.isIncreasing ? (
                  <ChevronUpIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Doanh thu</p>
                <p
                  className={`text-xl font-semibold ${
                    revenueTrend.isIncreasing
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {revenueTrend.isIncreasing ? "+" : "-"}
                  {revenueTrend.value}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`rounded-full p-3 ${
                  completionTrend.isIncreasing ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {completionTrend.isIncreasing ? (
                  <ChevronUpIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Dịch vụ hoàn thành</p>
                <p
                  className={`text-xl font-semibold ${
                    completionTrend.isIncreasing
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {completionTrend.isIncreasing ? "+" : "-"}
                  {completionTrend.value}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lịch hẹn tháng hiện tại */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch hẹn tháng hiện tại</CardTitle>
          <CardDescription>
            Phân tích trạng thái của {data.currentMonthStatusBreakdown.total}{" "}
            lịch hẹn trong tháng này
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statusData.map((status, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{status.name}</span>
                  <span className="text-sm text-gray-500">
                    {status.value} (
                    {data.currentMonthStatusBreakdown.total > 0
                      ? Math.round(
                          (status.value /
                            data.currentMonthStatusBreakdown.total) *
                            100
                        )
                      : 0}
                    %)
                  </span>
                </div>
                <Progress
                  value={
                    data.currentMonthStatusBreakdown.total > 0
                      ? (status.value /
                          data.currentMonthStatusBreakdown.total) *
                        100
                      : 0
                  }
                  className="h-2"
                  style={
                    {
                      backgroundColor: "rgba(0,0,0,0.1)",
                      "--progress-foreground": status.color,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Biểu đồ hiệu suất theo tháng */}
      <Card>
        <CardHeader>
          <CardTitle>Hiệu suất theo tháng</CardTitle>
          <CardDescription>Lịch hẹn trong 6 tháng qua</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Tổng số"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Hoàn thành"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  name="Đã hủy"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Biểu đồ doanh thu */}
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo tháng</CardTitle>
          <CardDescription>Doanh thu phát sinh theo thời gian</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#3b82f6" name="Doanh thu" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Phân tích dịch vụ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Phân tích dịch vụ</CardTitle>
            <CardDescription>Các loại dịch vụ đã thực hiện</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tóm tắt lịch hẹn sắp tới */}
        <Card>
          <CardHeader>
            <CardTitle>Tổng quan lịch hẹn</CardTitle>
            <CardDescription>Thống kê tổng quát</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-500">Sắp tới</span>
                  <p className="text-xl font-semibold">
                    {data.upcomingAppointments}
                  </p>
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-500">Đã hoàn thành</span>
                  <p className="text-xl font-semibold">
                    {data.completedAppointments}
                  </p>
                </div>
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-500">Đã hủy</span>
                  <p className="text-xl font-semibold">
                    {data.cancelledAppointments}
                  </p>
                </div>
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-500">Tổng doanh thu</span>
                  <p className="text-xl font-semibold">
                    {formatCurrency(data.totalRevenue)}
                  </p>
                </div>
                <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thống kê bổ sung */}
      {data.scheduleStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê lịch làm việc</CardTitle>
              <CardDescription>Dữ liệu tận dụng và hiệu quả</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Tỷ lệ sử dụng</span>
                    <span className="text-sm text-gray-500">
                      {data.scheduleStats.utilizationRate.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={data.scheduleStats.utilizationRate}
                    className="h-2"
                    style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {data.scheduleStats.utilizationRate > 80
                      ? "Tận dụng thời gian làm việc tuyệt vời"
                      : "Cân nhắc tối ưu hóa lịch trình để sử dụng thời gian tốt hơn"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3">
                    <h4 className="text-sm font-medium text-gray-500">
                      Ngày làm việc
                    </h4>
                    <p className="text-xl font-semibold mt-1">
                      {data.scheduleStats.workingDays}/
                      {data.scheduleStats.totalDays}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {data.scheduleStats.workingDaysPercentage.toFixed(0)}% khả
                      dụng
                    </p>
                  </div>

                  <div className="rounded-lg border p-3">
                    <h4 className="text-sm font-medium text-gray-500">
                      Giờ TB/Ngày
                    </h4>
                    <p className="text-xl font-semibold mt-1">
                      {data.scheduleStats.averageHoursPerWorkingDay.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Giờ mỗi ngày làm việc
                    </p>
                  </div>

                  <div className="rounded-lg border p-3">
                    <h4 className="text-sm font-medium text-gray-500">
                      Tổng giờ làm việc
                    </h4>
                    <p className="text-xl font-semibold mt-1">
                      {data.scheduleStats.totalWorkingHours}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Tháng này</p>
                  </div>

                  <div className="rounded-lg border p-3">
                    <h4 className="text-sm font-medium text-gray-500">
                      Lịch hẹn/Giờ
                    </h4>
                    <p className="text-xl font-semibold mt-1">
                      {data.scheduleStats.appointmentsPerWorkingHour.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Mỗi giờ làm việc
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chỉ số hiệu suất</CardTitle>
              <CardDescription>Các chỉ số KPI và hiệu quả</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Tỷ lệ hoàn thành
                    </span>
                    <span className="text-sm text-gray-500">
                      {data.completionRate}%
                    </span>
                  </div>
                  <Progress
                    value={data.completionRate}
                    className="h-2"
                    style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Tỷ lệ hủy</span>
                    <span className="text-sm text-gray-500">
                      {data.cancellationRate}%
                    </span>
                  </div>
                  <Progress
                    value={data.cancellationRate}
                    className="h-2"
                    style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                  />
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Tổng lịch hẹn</p>
                    <p className="text-2xl font-semibold">
                      {data.totalAppointments}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Đánh giá tổng thể</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-semibold mr-2">
                        {data.rating.toFixed(1)}
                      </p>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(data.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmployeePerformanceDashboard;
