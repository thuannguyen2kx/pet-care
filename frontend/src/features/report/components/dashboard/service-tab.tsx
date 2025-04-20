import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ServiceAnalysisChart } from './dashboard-charts';
import { mapServiceBreakdownToChartData, formatCurrency, COLORS } from './dashboard-utils';
import { DashboardStatistics } from '@/features/report/types/api.types';


interface ServicesTabProps {
  dashboardData: DashboardStatistics['currentMonth'];
}

const ServicesTab: React.FC<ServicesTabProps> = ({ dashboardData }) => {
  // Process data for service breakdown
  const serviceData = dashboardData.serviceBreakdown 
    ? mapServiceBreakdownToChartData(dashboardData.serviceBreakdown)
    : [];
    
  // Convert service data for the analysis chart
  const serviceAnalysisData = serviceData.map(service => ({
    name: service.name,
    value: service.value / (serviceData.reduce((sum, s) => sum + s.value, 0) || 1) * 100
  }));

  return (
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
                  <span className="font-medium">{formatCurrency(service.amount || 0)}</span>
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
            Tỉ lệ sử dụng theo dịch vụ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceAnalysisChart data={serviceAnalysisData} height={396} />
        </CardContent>
      </Card>
      
      {/* Metrics summary */}
      <Card className="border-0 shadow-sm md:col-span-2">
        <CardHeader>
          <CardTitle>Chỉ số hiệu suất dịch vụ</CardTitle>
          <CardDescription>
            So sánh hiệu suất của các dịch vụ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardData.serviceBreakdown?.map((service, index) => (
              <div 
                key={index} 
                className="p-4 rounded-lg border border-gray-100 shadow-sm"
              >
                <h3 className="font-medium mb-2">{service.serviceName}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Số lần đặt</p>
                    <p className="font-medium">{service.count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Doanh thu</p>
                    <p className="font-medium">{formatCurrency(service.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Hoàn thành</p>
                    <p className="font-medium text-green-600">{service.completedCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Đã hủy</p>
                    <p className="font-medium text-red-500">{service.cancelledCount}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Tỉ lệ hoàn thành</p>
                  <div className="h-2 w-full bg-gray-100 rounded-full mt-1">
                    <div 
                      className="h-2 rounded-full bg-green-500" 
                      style={{ 
                        width: `${service.count > 0 
                          ? (service.completedCount / service.count) * 100 
                          : 0}%` 
                      }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesTab;