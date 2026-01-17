import { CheckCircle, DollarSign, UserCheck, Users } from 'lucide-react';

import { StatCard } from '@/features/customer/admin-app/customer-list/ui/stat-card';
import { useReportCustomers } from '@/features/report/api/get-report-customer';
import { ReportCustomersQuerySchema } from '@/features/report/domain/report-state';
import { formatCurrency } from '@/shared/lib/utils';
import { Card } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function AdminOverviewCustomerStats() {
  const customerStatsQuery = useReportCustomers({
    query: ReportCustomersQuerySchema.parse({}),
  });

  const overviewData = customerStatsQuery.data?.overview;

  if (customerStatsQuery.isLoading) {
    return <StatsGridSkeleton />;
  }

  if (!overviewData) {
    return null;
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Tổng khách hàng"
        value={overviewData.totalCustomers}
        icon={Users}
        change={`${overviewData.newCustomers} khách hàng mới trong 30 ngày qua`}
        iconBgColor="bg-primary/10"
        iconColor="text-primary"
      />

      <StatCard
        title="Đang hoạt động"
        value={overviewData.activeCustomers}
        change={`${((overviewData.activeCustomers / overviewData.totalCustomers) * 100).toFixed(0)}% tổng số`}
        icon={UserCheck}
        iconBgColor="bg-success/10"
        iconColor="text-success"
      />
      <StatCard
        title="Tổng doanh thu"
        value={formatCurrency(overviewData.totalSpent)}
        icon={DollarSign}
        iconBgColor="bg-warning/10"
        iconColor="text-warning"
      />
      <StatCard
        title="Tỉ lệ hoàn thành"
        value={`${overviewData.completionRate.toFixed(1)}%`}
        change={`${overviewData.completedBookings}/${overviewData.totalBookings} lịch hẹn`}
        icon={CheckCircle}
        iconBgColor="bg-accent/10"
        iconColor="text-accent"
      />
    </div>
  );
}

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="rounded-none border-none p-5 shadow-none">
          <div className="mb-4 flex items-start justify-between">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        </Card>
      ))}
    </div>
  );
}
