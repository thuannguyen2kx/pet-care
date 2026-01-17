import { useRevenueChartFilter } from '@/features/report/admin-app/report-overview/application/use-revenue-chart-filter';
import type { RevenueChartQuery } from '@/features/report/domain/report-state';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export function RevenueChartFilter() {
  const { filters, setFilters } = useRevenueChartFilter();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <TimePresetTabs
        value={filters.preset}
        onChange={(preset) => setFilters({ preset: preset as RevenueChartQuery['preset'] })}
      />

      <Separator orientation="vertical" />
      <GroupByTabs
        value={filters.groupBy}
        onChange={(groupBy) => setFilters({ groupBy: groupBy as RevenueChartQuery['groupBy'] })}
      />

      <Button variant="ghost" size="sm" onClick={() => setFilters({})} className="ml-auto">
        Đặt lại
      </Button>
    </div>
  );
}

type TimePreset = '7d' | '30d' | 'quarter' | 'year';

function TimePresetTabs({
  value,
  onChange,
  disabled,
}: {
  value?: TimePreset;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <Tabs value={value ?? '30d'} onValueChange={onChange}>
      <TabsList className="bg-muted/50 p-1">
        <TabsTrigger
          value="7d"
          disabled={disabled}
          className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          7 ngày
        </TabsTrigger>
        <TabsTrigger
          value="30d"
          disabled={disabled}
          className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          30 ngày
        </TabsTrigger>
        <TabsTrigger
          value="quarter"
          disabled={disabled}
          className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Quý
        </TabsTrigger>
        <TabsTrigger
          value="year"
          disabled={disabled}
          className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Năm
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
function GroupByTabs({
  value,
  onChange,
  disabled,
}: {
  value: 'day' | 'week' | 'month';
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="bg-muted/50">
        <TabsTrigger
          value="day"
          disabled={disabled}
          className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Ngày
        </TabsTrigger>
        <TabsTrigger
          value="week"
          disabled={disabled}
          className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Tuần
        </TabsTrigger>
        <TabsTrigger
          value="month"
          disabled={disabled}
          className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Tháng
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
