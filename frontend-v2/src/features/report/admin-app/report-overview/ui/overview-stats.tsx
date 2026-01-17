import { Calendar, DollarSign, PawPrint, Star } from 'lucide-react';

import { useReportOverviewController } from '@/features/report/admin-app/report-overview/application/use-report-overview-controller';
import { StatCard } from '@/features/report/admin-app/report-overview/ui/stat-card';
import { TimeFilter } from '@/features/report/admin-app/report-overview/ui/time-filter';
import { Skeleton } from '@/shared/ui/skeleton';

export function OverviewStats() {
  const ctrl = useReportOverviewController();

  return (
    <>
      <TimeFilter filter={ctrl.filters} onFilter={ctrl.setFilters} />

      {ctrl.isLoading || !ctrl.data ? (
        <OverviewStatsSkeleton />
      ) : (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tổng doanh thu"
            value={`${(ctrl.data.revenue.value / 1_000_000).toFixed(0)}M`}
            change={ctrl.data.revenue.change}
            icon={<DollarSign className="text-success h-6 w-6" />}
            iconBgClass="bg-success/10"
          />

          <StatCard
            title="Tổng lịch hẹn"
            value={ctrl.data.bookings.value}
            change={ctrl.data.bookings.change}
            icon={<Calendar className="text-primary h-6 w-6" />}
            iconBgClass="bg-primary/10"
          />

          <StatCard
            title="Tỷ lệ hoàn thành"
            value={`${ctrl.data.completionRate.value}%`}
            change={ctrl.data.completionRate.change}
            icon={<PawPrint className="text-accent-foreground h-6 w-6" />}
            iconBgClass="bg-accent"
          />

          <StatCard
            title="Đánh giá TB"
            value={ctrl.data.rating.value.toFixed(1)}
            change={ctrl.data.rating.change}
            icon={<Star className="h-6 w-6 text-yellow-600" />}
            iconBgClass="bg-yellow-500/10"
          />
        </div>
      )}
    </>
  );
}
function OverviewStatsSkeleton() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-27 rounded-xl" />
      ))}
    </div>
  );
}
