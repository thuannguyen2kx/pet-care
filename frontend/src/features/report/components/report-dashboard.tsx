import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  LineChart,
  Line
} from 'recharts';
import { 
  CalendarIcon, 
  TrendingUp, 
  TrendingDown, 
  Calendar as CalendarIconFull,
  Users,
  CheckCircle,
  DollarSign,
  FileText,
  RefreshCw,
  Download,
  Loader2,
  Badge
} from 'lucide-react';
import { useGetDashboardStatistics } from '../hooks/queries';

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const STATUS_COLORS = {
  completed: '#00C49F',
  pending: '#FFBB28',
  cancelled: '#FF8042',
  inProgress: '#0088FE'
};

// Period options for report filtering
const PERIOD_OPTIONS = [
  { value: 'day', label: 'Hôm nay' },
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'year', label: 'Năm nay' },
  { value: 'custom', label: 'Tùy chỉnh' }
];

const ReportDashboard = () => {
  // State for period selection
  const [period, setPeriod] = useState('month');
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // Query dashboard statistics
  const { data: dashboardStats, isLoading, refetch } = useGetDashboardStatistics();
  
  // Format currency in VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Set date range based on period
  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    
    const today = new Date();
    
    switch (value) {
      case 'day':
        setDateRange({ from: today, to: today });
        break;
      case 'week':
        setDateRange({
          from: startOfWeek(today, { locale: vi }),
          to: endOfWeek(today, { locale: vi })
        });
        break;
      case 'month':
        setDateRange({
          from: startOfMonth(today),
          to: endOfMonth(today)
        });
        break;
      case 'year':
        setDateRange({
          from: startOfYear(today),
          to: endOfYear(today)
        });
        break;
      case 'custom':
        setIsDatePickerOpen(true);
        break;
      default:
        break;
    }
  };

  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange.from || !dateRange.to) return 'Chọn khoảng thời gian';
    
    return `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}`;
  };

  // Dummy data for service breakdown (would come from API in production)
  const serviceData = [
    { name: 'Cắt tỉa lông', value: 35, amount: 7000000 },
    { name: 'Tắm spa', value: 25, amount: 5000000 },
    { name: 'Khám sức khỏe', value: 20, amount: 4000000 },
    { name: 'Điều trị bệnh', value: 15, amount: 3000000 },
    { name: 'Dịch vụ khác', value: 5, amount: 1000000 }
  ];

  // Dummy data for appointments by status
  const appointmentsByStatus = [
    { name: 'Hoàn thành', value: 120, color: STATUS_COLORS.completed },
    { name: 'Chờ xử lý', value: 45, color: STATUS_COLORS.pending },
    { name: 'Đã hủy', value: 20, color: STATUS_COLORS.cancelled },
    { name: 'Đang xử lý', value: 30, color: STATUS_COLORS.inProgress }
  ];

  // Dummy data for weekly revenue
  const weeklyRevenue = [
    { day: 'T2', amount: 1500000, count: 5 },
    { day: 'T3', amount: 2100000, count: 7 },
    { day: 'T4', amount: 1800000, count: 6 },
    { day: 'T5', amount: 2400000, count: 8 },
    { day: 'T6', amount: 2700000, count: 9 },
    { day: 'T7', amount: 3000000, count: 10 },
    { day: 'CN', amount: 1200000, count: 4 }
  ];

  // Dummy data for monthly trend
  const monthlyTrend = Array.from({ length: 12 }, (_, i) => ({
    month: format(new Date(2024, i, 1), 'MMM', { locale: vi }),
    revenue: Math.random() * 30000000 + 10000000,
    appointments: Math.floor(Math.random() * 100) + 50
  }));
  if(!dashboardStats) return null;
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
          
          {period === 'custom' && (
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-white border-0 min-w-[220px] justify-start"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{formatDateRange()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    // setDateRange(range);
                    if (range?.to) setIsDatePickerOpen(false);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
          
          <Button size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Làm mới
          </Button>
          
          <Button size="sm" variant="outline" className="bg-white border-0">
            <Download className="h-4 w-4 mr-1" />
            Xuất báo cáo
          </Button>
        </div>
      </div>
      
      {/* Thông tin tổng quan */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* KPI Cards */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Doanh thu</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {formatCurrency(dashboardStats?.currentMonth.revenue || 0)}
                  </h3>
                  <div className="flex items-center mt-1">
                    {dashboardStats?.changes.revenueGrowth >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={dashboardStats?.changes.revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                      {dashboardStats?.changes.revenueGrowth >= 0 ? "+" : ""}
                      {dashboardStats?.changes.revenueGrowth.toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">so với tháng trước</span>
                  </div>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Lịch hẹn</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {dashboardStats?.currentMonth.totalAppointments || 0}
                  </h3>
                  <div className="flex items-center mt-1">
                    {dashboardStats?.changes.appointmentsGrowth >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={dashboardStats?.changes.appointmentsGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                      {dashboardStats?.changes.appointmentsGrowth >= 0 ? "+" : ""}
                      {dashboardStats?.changes.appointmentsGrowth.toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">so với tháng trước</span>
                  </div>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <CalendarIconFull className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Tỉ lệ hoàn thành</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {dashboardStats?.currentMonth.totalAppointments ? 
                      ((dashboardStats.currentMonth.completedAppointments / 
                        dashboardStats.currentMonth.totalAppointments) * 100).toFixed(1) : 0}%
                  </h3>
                  <div className="flex items-center mt-1">
                    {dashboardStats?.changes.completionRateChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={dashboardStats?.changes.completionRateChange >= 0 ? "text-green-500" : "text-red-500"}>
                      {dashboardStats?.changes.completionRateChange >= 0 ? "+" : ""}
                      {dashboardStats?.changes.completionRateChange.toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">so với tháng trước</span>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">Dịch vụ hoàn thành</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {dashboardStats?.currentMonth.completedAppointments || 0}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      {dashboardStats?.previousMonth.completedAppointments || 0} tháng trước
                    </span>
                  </div>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Tabs chứa các báo cáo chi tiết */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
          <TabsTrigger 
            value="overview"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent"
          >
            Tổng quan
          </TabsTrigger>
          <TabsTrigger 
            value="services" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent"
          >
            Dịch vụ
          </TabsTrigger>
          <TabsTrigger 
            value="appointments"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent"
          >
            Lịch hẹn
          </TabsTrigger>
          <TabsTrigger 
            value="reports"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none bg-transparent"
          >
            Báo cáo
          </TabsTrigger>
        </TabsList>
        
        {/* Tab Tổng quan */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Biểu đồ doanh thu theo tuần */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Doanh thu theo tuần</CardTitle>
                <CardDescription>
                  Theo dõi doanh thu từng ngày trong tuần
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyRevenue} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis 
                        tickFormatter={(value) => `${(value / 1000000)}M`}
                        width={50}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(Number(value)), 'Doanh thu']}
                        cursor={{ fill: '#f3f4f6' }}
                        labelFormatter={(label) => `Ngày: ${label}`}
                      />
                      <Bar 
                        dataKey="amount" 
                        fill="#8884d8" 
                        radius={[4, 4, 0, 0]}
                        name="Doanh thu"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Biểu đồ lịch hẹn theo trạng thái */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Lịch hẹn theo trạng thái</CardTitle>
                <CardDescription>
                  Số lượng lịch hẹn theo từng trạng thái
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appointmentsByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {appointmentsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Số lượng']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Bảng top dịch vụ */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Dịch vụ phổ biến</CardTitle>
                <CardDescription>
                  Các dịch vụ được sử dụng nhiều nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [
                        name === 'value' ? `${value}%` : formatCurrency(Number(value)),
                        name === 'value' ? 'Tỉ lệ' : 'Doanh thu'
                      ]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Biểu đồ xu hướng theo tháng */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Xu hướng theo tháng</CardTitle>
                <CardDescription>
                  Doanh thu và số lượng lịch hẹn theo tháng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis 
                        yAxisId="left" 
                        tickFormatter={(value) => `${(value / 1000000)}M`} 
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        tickFormatter={(value) => value} 
                      />
                      <Tooltip formatter={(value, name) => [
                        name === 'revenue' ? formatCurrency(Number(value)) : value,
                        name === 'revenue' ? 'Doanh thu' : 'Lịch hẹn'
                      ]} />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8884d8" 
                        name="Doanh thu" 
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="appointments" 
                        stroke="#82ca9d" 
                        name="Lịch hẹn" 
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab Dịch vụ */}
        <TabsContent value="services">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Top 5 Dịch vụ theo doanh thu</CardTitle>
                <CardDescription>
                  Các dịch vụ mang lại doanh thu cao nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {serviceData.map((service, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>{service.name}</span>
                        <span className="font-medium">{formatCurrency(service.amount)}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${service.value}%`, 
                            backgroundColor: COLORS[index % COLORS.length] 
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Phân tích dịch vụ</CardTitle>
                <CardDescription>
                  Tỉ lệ hoàn thành và hủy theo dịch vụ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={serviceData} 
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                      <YAxis type="category" dataKey="name" width={80} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Tỉ lệ']} />
                      <Legend />
                      <Bar dataKey="value" name="Tỉ lệ sử dụng" fill="#8884d8" barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab Lịch hẹn */}
        <TabsContent value="appointments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Lịch hẹn theo ngày</CardTitle>
                <CardDescription>
                  Số lượng lịch hẹn trong tuần
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyRevenue} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis tickFormatter={(value) => value} />
                      <Tooltip formatter={(value) => [value, 'Lịch hẹn']} />
                      <Bar dataKey="count" name="Số lịch hẹn" fill="#82ca9d" barSize={40} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Phân tích trạng thái lịch hẹn</CardTitle>
                <CardDescription>
                  Tỉ lệ hoàn thành, hủy và chờ xử lý
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appointmentsByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {appointmentsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Số lượng']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm md:col-span-2">
              <CardHeader>
                <CardTitle>Hiệu suất nhân viên</CardTitle>
                <CardDescription>
                  Số lượng lịch hẹn hoàn thành theo nhân viên
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { name: 'Nguyễn Văn A', completed: 45, cancelled: 5 },
                        { name: 'Trần Thị B', completed: 38, cancelled: 3 },
                        { name: 'Lê Văn C', completed: 30, cancelled: 7 },
                        { name: 'Phạm Thị D', completed: 28, cancelled: 4 },
                        { name: 'Hoàng Văn E', completed: 25, cancelled: 2 }
                      ]} 
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" name="Hoàn thành" stackId="a" fill="#00C49F" />
                      <Bar dataKey="cancelled" name="Đã hủy" stackId="a" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab Báo cáo */}
        <TabsContent value="reports">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Danh sách báo cáo</CardTitle>
              <CardDescription>
                Quản lý và tạo báo cáo theo thời gian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Button variant="outline" className="bg-white shadow-sm gap-2">
                  <FileText className="h-4 w-4" />
                  Tạo báo cáo ngày
                </Button>
                <Button variant="outline" className="bg-white shadow-sm gap-2">
                  <FileText className="h-4 w-4" />
                  Tạo báo cáo tuần
                </Button>
                <Button variant="outline" className="bg-white shadow-sm gap-2">
                  <FileText className="h-4 w-4" />
                  Tạo báo cáo tháng
                </Button>
                <Button variant="outline" className="bg-white shadow-sm gap-2">
                  <FileText className="h-4 w-4" />
                  Tạo báo cáo năm
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-xs font-medium text-gray-500">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left">Báo cáo</th>
                      <th className="px-4 py-3 text-left">Loại</th>
                      <th className="px-4 py-3 text-left">Thời gian</th>
                      <th className="px-4 py-3 text-left">Doanh thu</th>
                      <th className="px-4 py-3 text-left">Lịch hẹn</th>
                      <th className="px-4 py-3 text-left">Ngày tạo</th>
                      <th className="px-4 py-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {/* Demo data for reports */}
                    {[...Array(5)].map((_, index) => {
                      const today = new Date();
                      const reportDate = new Date(today);
                      reportDate.setDate(today.getDate() - index * 7);
                      
                      const reportTypes = ['daily', 'weekly', 'monthly', 'yearly'];
                      const reportType = reportTypes[index % reportTypes.length];
                      
                      // Format the period based on report type
                      let periodLabel = format(reportDate, 'dd/MM/yyyy');
                      if (reportType === 'weekly') {
                        const endDate = new Date(reportDate);
                        endDate.setDate(reportDate.getDate() + 6);
                        periodLabel = `${format(reportDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;
                      } else if (reportType === 'monthly') {
                        periodLabel = format(reportDate, 'MM/yyyy');
                      } else if (reportType === 'yearly') {
                        periodLabel = format(reportDate, 'yyyy');
                      }
                      
                      const revenue = Math.floor(Math.random() * 50000000) + 10000000;
                      const appointments = Math.floor(Math.random() * 100) + 20;
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium">Báo cáo #{index + 1}</div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge  className={
                              reportType === 'daily' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              reportType === 'weekly' ? 'bg-green-100 text-green-800 border-green-200' :
                              reportType === 'monthly' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                              'bg-amber-100 text-amber-800 border-amber-200'
                            }>
                              {reportType === 'daily' ? 'Ngày' : 
                               reportType === 'weekly' ? 'Tuần' : 
                               reportType === 'monthly' ? 'Tháng' : 'Năm'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            {periodLabel}
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {formatCurrency(revenue)}
                          </td>
                          <td className="px-4 py-3">
                            {appointments}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {format(new Date(today.getTime() - index * 24 * 60 * 60 * 1000), 'dd/MM/yyyy HH:mm')}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-2">
                              <Button size="sm" variant="ghost">
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Hiển thị 1-5 trên tổng số 20 báo cáo
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled>
                    Trước
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary text-white">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    4
                  </Button>
                  <Button variant="outline" size="sm">
                    Sau
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportDashboard;