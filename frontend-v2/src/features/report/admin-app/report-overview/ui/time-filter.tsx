import { Download } from 'lucide-react';

import type { ReportOverviewQuery } from '@/features/report/domain/report-state';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

type Props = {
  filter: ReportOverviewQuery;
  onFilter: (filter: ReportOverviewQuery) => void;
};
export function TimeFilter({ filter, onFilter }: Props) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Select
        value={filter.timeRange}
        onValueChange={(value) =>
          onFilter({ timeRange: value as ReportOverviewQuery['timeRange'] })
        }
      >
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border-border">
          <SelectItem value="week">7 ngày qua</SelectItem>
          <SelectItem value="month">30 ngày qua</SelectItem>
          <SelectItem value="quarter">Quý này</SelectItem>
          <SelectItem value="year">Năm nay</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" className="gap-2 bg-transparent">
        <Download className="h-4 w-4" />
        Xuất báo cáo
      </Button>
    </div>
  );
}
