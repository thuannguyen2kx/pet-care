import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  AppointmentBarChart, 
  StatusPieChart, 
  EmployeePerformanceChart 
} from './dashboard-charts';
import { 
  mapAppointmentStatusToChartData,
} from './dashboard-utils';
import { DashboardStatistics } from '@/features/report/types/api.types';

interface AppointmentsTabProps {
  dashboardData: DashboardStatistics['currentMonth'];
}

const AppointmentsTab: React.FC<AppointmentsTabProps> = ({ dashboardData }) => {
  // Use weekly data for appointments chart
  const weeklyData = dashboardData?.weeklyData || [];
  
  // Process data for appointment status chart
  const appointmentStatusData = dashboardData 
    ? mapAppointmentStatusToChartData(dashboardData.appointments)
    : [];
    
  // Process employee performance data
  const employeePerformanceData = dashboardData?.employeePerformance
    ? dashboardData.employeePerformance.map(employee => ({
        name: employee.employeeName,
        completed: employee.completedAppointments,
        cancelled: employee.cancelledAppointments
      })).slice(0, 5) // Take top 5
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Lịch hẹn theo ngày</CardTitle>
          <CardDescription>
            Số lượng lịch hẹn trong tuần
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentBarChart data={weeklyData} height={280} />
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
          <StatusPieChart data={appointmentStatusData} height={280} />
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
          <EmployeePerformanceChart data={employeePerformanceData} height={280} />
        </CardContent>
      </Card>
      
      {/* Appointment KPIs table */}
      <Card className="border-0 shadow-sm md:col-span-2">
        <CardHeader>
          <CardTitle>Chỉ số lịch hẹn chi tiết</CardTitle>
          <CardDescription>
            Số liệu thống kê về lịch hẹn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-gray-100 bg-blue-50">
              <h3 className="font-medium text-blue-800 mb-2">Tổng số lịch hẹn</h3>
              <p className="text-3xl font-bold">{dashboardData.appointments.total || 0}</p>
              <div className="mt-2 text-sm text-blue-600">
                <p>Đang chờ: {dashboardData?.appointments.pending || 0}</p>
                <p>Đã xác nhận: {dashboardData?.appointments.confirmed || 0}</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-gray-100 bg-green-50">
              <h3 className="font-medium text-green-800 mb-2">Lịch hẹn hoàn thành</h3>
              <p className="text-3xl font-bold">{dashboardData?.appointments.completed || 0}</p>
              <div className="mt-2 text-sm text-green-600">
                <p>Tỉ lệ hoàn thành: {
                  dashboardData?.appointments.total
                    ? ((dashboardData.appointments.completed / dashboardData.appointments.total) * 100).toFixed(1)
                    : 0
                }%</p>
                <p>Đang thực hiện: {dashboardData?.appointments.inProgress || 0}</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-gray-100 bg-red-50">
              <h3 className="font-medium text-red-800 mb-2">Lịch hẹn đã hủy</h3>
              <p className="text-3xl font-bold">{dashboardData?.appointments.cancelled || 0}</p>
              <div className="mt-2 text-sm text-red-600">
                <p>Tỉ lệ hủy: {
                  dashboardData?.appointments.total
                    ? ((dashboardData.appointments.cancelled / dashboardData.appointments.total) * 100).toFixed(1)
                    : 0
                }%</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-3">Hiệu suất nhân viên chi tiết</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs font-medium text-gray-500">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left">Nhân viên</th>
                    <th className="px-4 py-3 text-center">Tổng số</th>
                    <th className="px-4 py-3 text-center">Hoàn thành</th>
                    <th className="px-4 py-3 text-center">Đã hủy</th>
                    <th className="px-4 py-3 text-center">Tỉ lệ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {dashboardData?.employeePerformance?.map((employee, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{employee.employeeName}</td>
                      <td className="px-4 py-3 text-center">{employee.totalAppointments}</td>
                      <td className="px-4 py-3 text-center text-green-600">{employee.completedAppointments}</td>
                      <td className="px-4 py-3 text-center text-red-500">{employee.cancelledAppointments}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 inline-block" style={{ width: '100px' }}>
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ 
                              width: `${employee.totalAppointments > 0 
                                ? (employee.completedAppointments / employee.totalAppointments) * 100 
                                : 0}%` 
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsTab;