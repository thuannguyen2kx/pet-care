import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  RevenueBarChart, 
  StatusPieChart, 
  ServicePieChart, 
  MonthlyTrendChart 
} from './dashboard-charts';
import { 
  mapAppointmentStatusToChartData, 
  mapServiceBreakdownToChartData,
} from './dashboard-utils';
import { DashboardStatistics } from '@/features/report/types/api.types';

interface OverviewTabProps {
  dashboardData: DashboardStatistics['currentMonth'];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ dashboardData }) => {
  const weeklyRevenueData = dashboardData.weeklyData || [];
  
  const monthlyTrendData = dashboardData.monthlyTrendData || []
  
  // Process data for appointment status chart
  const appointmentStatusData = dashboardData.appointments
    ? mapAppointmentStatusToChartData(dashboardData.appointments)
    : [];
    
  // Process data for service breakdown chart
  const serviceData = dashboardData.serviceBreakdown
    ? mapServiceBreakdownToChartData(dashboardData.serviceBreakdown)
    : [];

  return (
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
          <RevenueBarChart data={weeklyRevenueData} height={280} />
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
          <StatusPieChart data={appointmentStatusData} height={280} />
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
          <ServicePieChart data={serviceData} height={280} />
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
          <MonthlyTrendChart data={monthlyTrendData} height={280} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;