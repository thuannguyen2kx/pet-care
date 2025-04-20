import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
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
  Legend
} from 'recharts';
import { Download, Printer, ArrowLeft, FileText } from 'lucide-react';
import { useReport } from '@/features/report/hooks/queries';
import { formatCurrency, COLORS, STATUS_COLORS } from './dashboard/dashboard-utils';

interface ReportDetailProps {
  reportId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ reportId, isOpen, onClose }) => {
  const { data, isLoading } = useReport(reportId);
  const report = data?.report;
  
  // Helper function to format date based on report type
  const formatReportDate = () => {
    if (!report) return '';
    
    const startDate = new Date(report.period.start);
    const endDate = new Date(report.period.end);
    
    switch (report.reportType) {
      case 'daily':
        return format(startDate, 'dd/MM/yyyy');
      case 'weekly':
        return `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;
      case 'monthly':
        return format(startDate, 'MM/yyyy');
      case 'yearly':
        return format(startDate, 'yyyy');
      default:
        return '';
    }
  };
  
  // Helper function to get report type title
  const getReportTypeTitle = () => {
    if (!report) return '';
    
    switch (report.reportType) {
      case 'daily':
        return 'Báo cáo ngày';
      case 'weekly':
        return 'Báo cáo tuần';
      case 'monthly':
        return 'Báo cáo tháng';
      case 'yearly':
        return 'Báo cáo năm';
      default:
        return '';
    }
  };
  
  if (!reportId || !isOpen) return null;
  
  // Prepare appointment status data for chart
  const appointmentStatusData = report?.metrics?.appointments ? [
    { name: 'Hoàn thành', value: report.metrics.appointments.completed, color: STATUS_COLORS.completed },
    { name: 'Chờ xử lý', value: report.metrics.appointments.pending, color: STATUS_COLORS.pending },
    { name: 'Đã hủy', value: report.metrics.appointments.cancelled, color: STATUS_COLORS.cancelled },
    { name: 'Đang xử lý', value: report.metrics.appointments.inProgress, color: STATUS_COLORS.inProgress }
  ] : [];
  
  // Prepare service data for chart
  const serviceData = report?.metrics?.serviceBreakdown?.map(service => ({
    name: service.serviceName,
    value: service.count,
    amount: service.revenue
  })) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                {getReportTypeTitle()} - {formatReportDate()}
              </DialogTitle>
              <DialogDescription>
                Chi tiết báo cáo và thống kê
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                In báo cáo
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Tải xuống
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : !report ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500">Không tìm thấy báo cáo</p>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="services">Dịch vụ</TabsTrigger>
              <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
              <TabsTrigger value="customers">Khách hàng</TabsTrigger>
            </TabsList>
            
            {/* Tab Tổng quan */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Tổng doanh thu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(report.metrics.revenue.total)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Trung bình: {formatCurrency(report.metrics.revenue.avgPerAppointment)} / lịch hẹn
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Tổng lịch hẹn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {report.metrics.appointments.total}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Hoàn thành: {report.metrics.appointments.completed} ({
                        report.metrics.appointments.total > 0 
                          ? ((report.metrics.appointments.completed / report.metrics.appointments.total) * 100).toFixed(1) 
                          : 0
                      }%)
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Khách hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {report.metrics.customers.total}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mới: {report.metrics.customers.new}, Quay lại: {report.metrics.customers.recurring}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Lịch hẹn theo trạng thái</CardTitle>
                    <CardDescription>
                      Tỉ lệ hoàn thành, hủy và chờ xử lý
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={appointmentStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {appointmentStatusData.map((entry, index) => (
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
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Dịch vụ hàng đầu</CardTitle>
                    <CardDescription>
                      Các dịch vụ được sử dụng nhiều nhất
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={serviceData.slice(0, 5)}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={90} />
                          <Tooltip formatter={(value) => [value, 'Số lượng']} />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Tab Dịch vụ */}
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết dịch vụ</CardTitle>
                  <CardDescription>
                    Phân tích dịch vụ trong kỳ báo cáo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-xs font-medium text-gray-500">
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left">Dịch vụ</th>
                          <th className="px-4 py-3 text-center">Số lượng</th>
                          <th className="px-4 py-3 text-center">Hoàn thành</th>
                          <th className="px-4 py-3 text-center">Đã hủy</th>
                          <th className="px-4 py-3 text-right">Doanh thu</th>
                          <th className="px-4 py-3 text-right">Tỉ lệ hoàn thành</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 text-sm">
                        {report.metrics.serviceBreakdown.map((service, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{service.serviceName}</td>
                            <td className="px-4 py-3 text-center">{service.count}</td>
                            <td className="px-4 py-3 text-center text-green-600">{service.completedCount}</td>
                            <td className="px-4 py-3 text-center text-red-500">{service.cancelledCount}</td>
                            <td className="px-4 py-3 text-right font-medium">{formatCurrency(service.revenue)}</td>
                            <td className="px-4 py-3 text-right">
                              {service.count > 0 ? ((service.completedCount / service.count) * 100).toFixed(1) : 0}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 font-medium text-gray-900">
                        <tr>
                          <td className="px-4 py-3">Tổng cộng</td>
                          <td className="px-4 py-3 text-center">
                            {report.metrics.serviceBreakdown.reduce((sum, service) => sum + service.count, 0)}
                          </td>
                          <td className="px-4 py-3 text-center text-green-600">
                            {report.metrics.serviceBreakdown.reduce((sum, service) => sum + service.completedCount, 0)}
                          </td>
                          <td className="px-4 py-3 text-center text-red-500">
                            {report.metrics.serviceBreakdown.reduce((sum, service) => sum + service.cancelledCount, 0)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatCurrency(report.metrics.serviceBreakdown.reduce((sum, service) => sum + service.revenue, 0))}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {report.metrics.appointments.total > 0 
                              ? ((report.metrics.appointments.completed / report.metrics.appointments.total) * 100).toFixed(1) 
                              : 0}%
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tab Hiệu suất */}
            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Hiệu suất nhân viên</CardTitle>
                  <CardDescription>
                    Thống kê theo từng nhân viên
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-xs font-medium text-gray-500">
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left">Nhân viên</th>
                          <th className="px-4 py-3 text-center">Tổng số</th>
                          <th className="px-4 py-3 text-center">Hoàn thành</th>
                          <th className="px-4 py-3 text-center">Đã hủy</th>
                          <th className="px-4 py-3 text-right">Doanh thu</th>
                          <th className="px-4 py-3 text-right">Tỉ lệ hoàn thành</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 text-sm">
                        {report.metrics.employeePerformance.map((employee, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{employee.employeeName}</td>
                            <td className="px-4 py-3 text-center">{employee.totalAppointments}</td>
                            <td className="px-4 py-3 text-center text-green-600">{employee.completedAppointments}</td>
                            <td className="px-4 py-3 text-center text-red-500">{employee.cancelledAppointments}</td>
                            <td className="px-4 py-3 text-right font-medium">{formatCurrency(employee.revenue)}</td>
                            <td className="px-4 py-3 text-right">
                              {employee.totalAppointments > 0 
                                ? ((employee.completedAppointments / employee.totalAppointments) * 100).toFixed(1) 
                                : 0}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Employee Performance Chart */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-3">Biểu đồ hiệu suất</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={report.metrics.employeePerformance.map(emp => ({
                            name: emp.employeeName,
                            completed: emp.completedAppointments,
                            cancelled: emp.cancelledAppointments,
                            pending: emp.totalAppointments - emp.completedAppointments - emp.cancelledAppointments
                          }))}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="completed" name="Hoàn thành" stackId="a" fill="#00C49F" />
                          <Bar dataKey="cancelled" name="Đã hủy" stackId="a" fill="#FF8042" />
                          <Bar dataKey="pending" name="Chờ xử lý" stackId="a" fill="#FFBB28" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tab Khách hàng */}
            <TabsContent value="customers">
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê khách hàng</CardTitle>
                  <CardDescription>
                    Số liệu về khách hàng trong kỳ báo cáo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-800 mb-1">Tổng khách hàng</h3>
                      <p className="text-3xl font-bold text-blue-900">{report.metrics.customers.total}</p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="text-sm font-medium text-green-800 mb-1">Khách hàng mới</h3>
                      <p className="text-3xl font-bold text-green-900">{report.metrics.customers.new}</p>
                      <p className="text-xs text-green-700 mt-1">
                        {report.metrics.customers.total > 0 
                          ? ((report.metrics.customers.new / report.metrics.customers.total) * 100).toFixed(1) 
                          : 0}% tổng khách hàng
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h3 className="text-sm font-medium text-purple-800 mb-1">Khách hàng quay lại</h3>
                      <p className="text-3xl font-bold text-purple-900">{report.metrics.customers.recurring}</p>
                      <p className="text-xs text-purple-700 mt-1">
                        {report.metrics.customers.total > 0 
                          ? ((report.metrics.customers.recurring / report.metrics.customers.total) * 100).toFixed(1) 
                          : 0}% tổng khách hàng
                      </p>
                    </div>
                  </div>
                  
                  {/* Customer Donut Chart */}
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Khách hàng mới', value: report.metrics.customers.new, color: COLORS[0] },
                            { name: 'Khách hàng quay lại', value: report.metrics.customers.recurring, color: COLORS[1] }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: 'Khách hàng mới', value: report.metrics.customers.new, color: COLORS[0] },
                            { name: 'Khách hàng quay lại', value: report.metrics.customers.recurring, color: COLORS[1] }
                          ].map((entry, index) => (
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
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportDetail;