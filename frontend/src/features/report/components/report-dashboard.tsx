import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
} from "date-fns";
import { vi } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Calendar as CalendarIconFull,
  Users,
  CheckCircle,
  DollarSign,
  RefreshCw,
  Download,
} from "lucide-react";

import {
  formatCurrency,
  formatDateRange,
  PERIOD_OPTIONS,
} from "./dashboard/dashboard-utils";
import { KPICard } from "./dashboard/kpt-card";
import OverviewTab from "./dashboard/overview-tab";
import ServicesTab from "./dashboard/service-tab";
import AppointmentsTab from "./dashboard/appointment-tab";
import ReportsList from "./dashboard/report-list";

import { useDashboardStatistics } from "@/features/report/hooks/queries";
import { DateRange } from "@/features/report/types/api.types";
import DashboardSkeleton from "./report-dashboard-skeleton";

const ReportDashboard = () => {
  // State for period selection
  const [period, setPeriod] = useState("month");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Query dashboard statistics
  const {
    data: dashboardStatsResponse,
    isLoading,
    refetch,
  } = useDashboardStatistics();
  const dashboardStats = dashboardStatsResponse?.statistics;

  // Set date range based on period
  const handlePeriodChange = (value: string) => {
    setPeriod(value);

    const today = new Date();

    switch (value) {
      case "day":
        setDateRange({ from: today, to: today });
        break;
      case "week":
        setDateRange({
          from: startOfWeek(today, { locale: vi }),
          to: endOfWeek(today, { locale: vi }),
        });
        break;
      case "month":
        setDateRange({
          from: startOfMonth(today),
          to: endOfMonth(today),
        });
        break;
      case "year":
        setDateRange({
          from: startOfYear(today),
          to: endOfYear(today),
        });
        break;
      case "custom":
        setIsDatePickerOpen(true);
        break;
      default:
        break;
    }
  };

  // Handle date range selection
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDateRange(range);
      if (range.to) setIsDatePickerOpen(false);
    }
  };

  // Handle report export
  const handleExportReport = () => {
    // In a real app, this would trigger an API call to download a report
    console.log("Export report for period:", dateRange);
  };


  if(isLoading) return <DashboardSkeleton />
  if (!dashboardStats && !isLoading) return null;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Báo cáo & Thống kê</h1>

        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px] bg-white border-0">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {period === "custom" && (
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white border-0 min-w-[220px] justify-start"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{formatDateRange(dateRange?.from, dateRange?.to)}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateRangeSelect}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}

          <Button size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Làm mới
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="bg-white border-0"
            onClick={handleExportReport}
          >
            <Download className="h-4 w-4 mr-1" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

     
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* KPI Cards */}
          <KPICard
            title="Doanh thu"
            value={formatCurrency(dashboardStats?.currentMonth.revenue || 0)}
            change={dashboardStats?.changes.revenueGrowth}
            icon={<DollarSign className="h-6 w-6 text-primary" />}
          />

          <KPICard
            title="Lịch hẹn"
            value={dashboardStats?.currentMonth.totalAppointments || 0}
            change={dashboardStats?.changes.appointmentsGrowth}
            icon={<CalendarIconFull className="h-6 w-6 text-blue-600" />}
          />

          <KPICard
            title="Tỉ lệ hoàn thành"
            value={`${
              dashboardStats?.currentMonth.totalAppointments
                ? (
                    (dashboardStats.currentMonth.completedAppointments /
                      dashboardStats.currentMonth.totalAppointments) *
                    100
                  ).toFixed(1)
                : 0
            }%`}
            change={dashboardStats?.changes.completionRateChange}
            icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          />

          <KPICard
            title="Dịch vụ hoàn thành"
            value={dashboardStats?.currentMonth.completedAppointments || 0}
            subtitle={`${
              dashboardStats?.previousMonth.completedAppointments || 0
            } tháng trước`}
            icon={<Users className="h-6 w-6 text-purple-600" />}
          />
        </div>

      {/* Tabs chứa các báo cáo chi tiết */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Tổng quan
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Dịch vụ
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Lịch hẹn
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            Báo cáo
          </TabsTrigger>
        </TabsList>

        {dashboardStats?.currentMonth && (
          <>
            {/* Tab Tổng quan */}
            <TabsContent value="overview">
              <OverviewTab dashboardData={dashboardStats?.currentMonth} />
            </TabsContent>
            {/* Tab Dịch vụ */}
            <TabsContent value="services">
              <ServicesTab dashboardData={dashboardStats?.currentMonth} />
            </TabsContent>
            {/* Tab Lịch hẹn */}
            <TabsContent value="appointments">
              <AppointmentsTab
                dashboardData={dashboardStats?.currentMonth || {}}
              />
            </TabsContent>
          </>
        )}

        {/* Tab Báo cáo */}
        <TabsContent value="reports">
          <Card className="border-0 shadow-sm p-4">
            <ReportsList />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDashboard;
