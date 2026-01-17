import { BarChart3, PieChart, Users } from 'lucide-react';

import { OverviewStats } from '@/features/report/admin-app/report-overview/ui/overview-stats';
import { ReportServicesTab } from '@/features/report/admin-app/report-overview/ui/report-services-tab';
import { EmployeeReportWidget } from '@/features/report/admin-app/report-overview/widgets/employee-report-widget';
import { RevenueWidget } from '@/features/report/admin-app/report-overview/widgets/revenue-widget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export default function AdminReportOverviewPage() {
  return (
    <>
      <OverviewStats />
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger
            value="revenue"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground text-foreground gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Doanh thu
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground text-foreground gap-2"
          >
            <PieChart className="h-4 w-4" />
            Dịch vụ
          </TabsTrigger>
          <TabsTrigger
            value="employees"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground text-foreground gap-2"
          >
            <Users className="h-4 w-4" />
            Nhân viên
          </TabsTrigger>
        </TabsList>
        <TabsContent value="revenue">
          <RevenueWidget />
        </TabsContent>
        <TabsContent value="services">
          <ReportServicesTab />
        </TabsContent>
        <TabsContent value="employees">
          <EmployeeReportWidget />
        </TabsContent>
      </Tabs>
    </>
  );
}
