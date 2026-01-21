import { format } from 'date-fns';
import { Clock, Coffee } from 'lucide-react';

import type { TBreakTemplate } from '@/features/employee-schedule/types';
import { Badge } from '@/shared/ui/badge';

type Props = {
  breaks: TBreakTemplate[];
};

export function BreakTemplateList({ breaks }: Props) {
  return (
    <div className="space-y-2">
      {breaks.map((breakItem) => (
        <div
          key={breakItem._id}
          className="group rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-300 hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <Coffee className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-gray-900">{breakItem.name}</p>
                  <Badge variant={breakItem.isActive ? 'default' : 'destructive'}>
                    {breakItem.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {breakItem.startTime} - {breakItem.endTime}
                  </span>
                  <span className="text-xs">
                    {format(breakItem.effectiveFrom, 'dd/MM/yyyy')} →{' '}
                    {format(breakItem.effectiveTo, 'dd/MM/yyyy')}
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
