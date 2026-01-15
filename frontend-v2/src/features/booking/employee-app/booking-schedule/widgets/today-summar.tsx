import { useEmployeeBookingTodayStatistic } from '@/features/booking/api/get-booking-statistic-today';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/ui/card';

export function TodaySummary() {
  const statsQuery = useEmployeeBookingTodayStatistic();

  if (statsQuery.isLoading) {
    return (
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const stats = statsQuery.data;

  if (!stats) return null;
  const statCards = [
    {
      label: 'Tổng cộng',
      value: stats.totalBookings,
      color: 'bg-muted',
    },
    {
      label: 'Chờ xác nhận',
      value: stats.byStatus.pending,
      color: 'bg-warning/10',
    },
    {
      label: 'Đã xác nhận',
      value: stats.byStatus.confirmed,
      color: 'bg-primary/10',
    },
    {
      label: 'Đang thực hiện',
      value: stats.byStatus['in-progress'],
      color: 'bg-accent/50',
    },
    {
      label: 'Hoàn thành',
      value: stats.byStatus.completed,
      color: 'bg-success/10',
    },
  ];
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
      {statCards.map((stat) => (
        <Card key={stat.label} className={cn('rounded-none border-none shadow-none', stat.color)}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-muted-foreground text-xs">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
function StatCardSkeleton() {
  return (
    <Card className="rounded-none border-none shadow-none">
      <CardContent className="p-4">
        <div className="animate-pulse space-y-2">
          <div className="bg-muted mx-auto h-8 w-16 rounded"></div>
          <div className="bg-muted mx-auto h-3 w-20 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}
