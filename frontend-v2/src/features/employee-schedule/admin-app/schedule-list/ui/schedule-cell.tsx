import { isToday as isTodayDateFns } from 'date-fns';
import { Check, X } from 'lucide-react';

import type { EmployeeSchedule } from '@/features/employee-schedule/domain/schedule.entity';
import { Badge } from '@/shared/ui/badge';

type Props = {
  day: EmployeeSchedule;
};

export function ScheduleCell({ day }: Props) {
  const isWorking = day.isWorking;
  const isToday = isTodayDateFns(new Date(day.date));
  return (
    <td className={`p-2 text-center ${isToday ? 'bg-primary/5' : ''}`}>
      {isWorking ? (
        <Badge className="bg-success/10 text-success border-success/30 hover:bg-success/20">
          <Check className="mr-1 h-3 w-3" />
          Làm việc
        </Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground border-border">
          <X className="mr-1 h-3 w-3" />
          Nghỉ
        </Badge>
      )}
    </td>
  );
}
