import { Calendar, CheckCircle2, DollarSign, Star } from 'lucide-react';

import { StatCard, StatCardSkeleton } from '@/features/dashboard/employee-app/ui/stat-card';
import { useEmployeeDashboardStats } from '@/features/employee/api/get-employee-dashboard-stats';

export function EmployeeStatsOverview() {
  const statsQuery = useEmployeeDashboardStats();

  if (statsQuery.isLoading) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  const stats = statsQuery.data;

  if (!stats) return null;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Đánh giá trung bình" value={stats.rating.average} icon={Star} />

      <StatCard
        title="Lịch hẹn hôm nay"
        value={stats.todayBookings.total}
        change={`${stats.todayBookings.pending} đang chờ xác nhận`}
        icon={Calendar}
      />

      <StatCard
        title="Dịch vụ đã hoàn thành"
        value={stats.completedServices.total}
        change={`+${stats.completedServices.thisMonth} tháng này`}
        icon={CheckCircle2}
      />

      <StatCard
        title="Doanh thu tháng"
        value={`${(stats.revenue.thisMonth / 1_000_000).toFixed(1)}M`}
        icon={DollarSign}
      />
    </div>
  );
}
