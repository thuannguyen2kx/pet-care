import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';

import type { ShiftOverride } from '@/features/employee-schedule/domain/schedule.entity';
import { Badge } from '@/shared/ui/badge';

type Props = {
  shiftOverrides: ShiftOverride[];
};
export function ShiftOverrideList({ shiftOverrides }: Props) {
  return (
    <div className="space-y-2">
      {shiftOverrides.map((override) => (
        <div
          key={override.id}
          className="group rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-300 hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <AlertCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{format(override.date, 'dd/MM/yyyy')}</p>
                  <Badge variant={override.isWorking ? 'default' : 'destructive'}>
                    {override.isWorking ? 'Làm việc' : 'Nghỉ'}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-gray-600">{override.reason}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <span>Bởi: {override.createdBy?.fullName}</span>
                  <span>•</span>
                  <span>{format(override.createdAt, 'dd/MM/yyyy HH:mm')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
