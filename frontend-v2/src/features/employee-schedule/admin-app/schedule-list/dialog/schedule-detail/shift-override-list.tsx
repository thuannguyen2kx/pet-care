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
          className="group border-border rounded-lg border p-4 transition-all hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                <AlertCircle className="text-foreground h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-forground font-medium">
                    {format(override.date, 'dd/MM/yyyy')}
                  </p>
                  <Badge variant={override.isWorking ? 'default' : 'destructive'}>
                    {override.isWorking ? 'Làm việc' : 'Nghỉ'}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">{override.reason}</p>
                <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
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
