import { Calendar, DollarSign, PawPrint, Users } from 'lucide-react';

import { StatCard, StatCardSkeleton } from '@/features/dashboard/admin-app/ui/stat-card';
import { useAdminDashboardStat } from '@/features/report/api/get-admin-dashboard-stat';

export function AdminStatsOverview() {
  const statsQuery = useAdminDashboardStat();

  if (statsQuery.isLoading) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  const data = statsQuery.data;

  if (!data) return null;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Tổng nhân viên"
        value={data.employees.active}
        change={`${data.employees.total} tổng cộng`}
        icon={Users}
      />

      <StatCard title="Lịch hẹn hôm nay" value={data.bookings.today} icon={Calendar} />

      <StatCard
        title="Dịch vụ hoạt động"
        value={data.services.active}
        change={`${data.services.total} tổng cộng`}
        icon={PawPrint}
      />

      <StatCard
        title="Doanh thu tháng"
        value={`${(data.revenue.thisMonth / 1_000_000).toFixed(0)}M`}
        change={
          data.revenue.growthPercent !== null
            ? `+${data.revenue.growthPercent}% so với tháng trước`
            : 'Tháng đầu tiên'
        }
        changeType="positive"
        icon={DollarSign}
      />
    </div>
  );
}
