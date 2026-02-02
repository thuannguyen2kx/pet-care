import { format } from 'date-fns';
import { Clock, Coffee } from 'lucide-react';

import type { BreakTemplate } from '@/features/employee-schedule/domain/schedule.entity';
import { Badge } from '@/shared/ui/badge';

type Props = {
  breaks: BreakTemplate[];
};

export function BreakTemplateList({ breaks }: Props) {
  return (
    <div className="space-y-2">
      {breaks.map((breakItem) => (
        <div
          key={breakItem.id}
          className="group border-border rounded-lg border p-4 transition-all hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                <Coffee className="text-foreground h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-foreground font-medium">{breakItem.name}</p>
                  <Badge variant={breakItem.isActive ? 'default' : 'destructive'}>
                    {breakItem.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                  </Badge>
                </div>
                <div className="text-foreground mt-1 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {breakItem.startTime} - {breakItem.endTime}
                  </span>
                  <span className="text-xs">
                    {format(breakItem.effectiveFrom, 'dd/MM/yyyy')} →{' '}
                    {breakItem.effectiveTo
                      ? format(breakItem.effectiveTo, 'dd/MM/yyyy')
                      : 'Chưa cập nhật'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
