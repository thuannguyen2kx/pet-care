import { Scissors } from 'lucide-react';

import { useReportServicesByBookingCount } from '@/features/report/admin-app/report-overview/application/use-report-services-by-booking-count';
import type { ReportServiceStat } from '@/features/report/domain/report-entity';
import { getServiceCategoryConfig } from '@/features/service/config';
import type { ServiceCategory } from '@/features/service/domain/service.entity';
import { EmptyState } from '@/shared/components/template/empty-state';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Skeleton } from '@/shared/ui/skeleton';

export function ReportServiceByBookingCount() {
  const controller = useReportServicesByBookingCount();
  const services = controller.data?.services || [];
  return (
    <Card className="rounded-none border-none p-4 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Dịch vụ phổ biến</CardTitle>
          <CardDescription>Xếp hạng theo số lượt đặt</CardDescription>
        </div>

        <ReportServicePresetFilter
          value={controller.filters.preset}
          onChange={(preset) => controller.updateFilters({ preset })}
        />
      </CardHeader>
      <CardContent>
        <ServiceList isLoading={controller.isLoading} services={services} />
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
    return (
      <EmptyState
        title="Không có dữ liệu thông kê"
        description="Thông tin dịch vụ đang trống"
        icon={Scissors}
      />
    );
  }
  return (
    <div className="space-y-3">
      {services.map((service, idx) => {
        const categoryConfig = getServiceCategoryConfig(service.category as ServiceCategory);
        return (
          <div key={service.id} className="bg-muted/30 flex items-center gap-4 p-4">
            <span className="text-muted-foreground w-6 text-lg font-bold">{idx + 1}</span>
            <div className="flex-1">
              <p className="font-medium">{service.name}</p>
              <p className="text-muted-foreground text-sm">{service.bookingCount} lượt đặt</p>
            </div>
            <Badge variant="secondary" className="capitalize">
              {categoryConfig.label}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}

type Props = {
  value: string;
  onChange: (preset: '7d' | '30d' | 'quarter' | 'year') => void;
};

export function ReportServicePresetFilter({ value, onChange }: Props) {
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
