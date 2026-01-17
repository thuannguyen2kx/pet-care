import { Scissors } from 'lucide-react';

import { useReportServicesByRevenue } from '@/features/report/admin-app/report-overview/application/use-report-services-by-revenue';
import type { ReportServiceStat } from '@/features/report/domain/report-entity';
import { getCategoryConfig, type TCategory } from '@/features/service/constants';
import { EmptyState } from '@/shared/components/template/empty-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Skeleton } from '@/shared/ui/skeleton';

export function ReportServicesByRevenueWidget() {
  const controller = useReportServicesByRevenue();

  const data = controller.data?.services || [];
  return (
    <Card className="rounded-none border-none p-4 shadow-none">
      <CardHeader className="flow-row flex items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Doanh thu theo dịch vụ</CardTitle>
          <CardDescription>Dịch vụ mang lại doanh thu cao nhất</CardDescription>
        </div>
        <ReportServicePresetFilter
          value={controller.filters.preset}
          onChange={(preset) => controller.updateFilters({ preset })}
        />
      </CardHeader>
      <CardContent>
        <ServiceList isLoading={controller.isLoading} services={data} />
      </CardContent>
    </Card>
  );
}

function ServiceList({
  isLoading,
  services,
}: {
  isLoading: boolean;
  services: ReportServiceStat[];
}) {
  if (isLoading) {
    return <ServiceListSkeleton />;
  }
  if (!services.length) {
    <EmptyState
      title="Không có dữ liệu thông kê"
      description="Thông tin dịch vụ đang trống"
      icon={Scissors}
    />;
  }
  return (
    <div className="space-y-3">
      {services.map((service) => {
        const categoryConfig = getCategoryConfig(service.category as TCategory);
        return (
          <div key={service.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <categoryConfig.icon className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">{service.name}</p>
                <p className="text-muted-foreground text-xs">{service.bookingCount} lượt</p>
              </div>
            </div>
            <p className="text-primary font-semibold">{(service.revenue / 1000000).toFixed(1)}M</p>
          </div>
        );
      })}
    </div>
  );
}
export function ReportServicePresetFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (preset: '7d' | '30d' | 'quarter' | 'year') => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-border">
        <SelectItem value="7d">7 ngày</SelectItem>
        <SelectItem value="30d">30 ngày</SelectItem>
        <SelectItem value="quarter">Quý này</SelectItem>
        <SelectItem value="year">Năm nay</SelectItem>
      </SelectContent>
    </Select>
  );
}

function ServiceListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border-border border p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
