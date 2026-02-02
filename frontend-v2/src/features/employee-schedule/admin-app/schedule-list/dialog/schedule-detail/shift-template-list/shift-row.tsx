import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

import type { ShiftTemplate } from '@/features/employee-schedule/domain/schedule.entity';
import { Badge } from '@/shared/ui/badge';

const dayOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

export function ShiftRow({ shift }: { shift: ShiftTemplate }) {
  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg">
        <Calendar className="text-foreground h-5 w-5" />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground font-medium">{dayOfWeek[shift.dayOfWeek]}</p>

          <Badge variant={shift.isActive ? 'default' : 'destructive'}>
            {shift.isActive ? 'Hoạt động' : 'Tạm ngưng'}
          </Badge>
        </div>

        <div className="text-foreground mt-1 flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          {shift.startTime} – {shift.endTime}
        </div>

        <div className="mt-1 text-xs text-gray-500">
          {shift.effectiveTo ? (
            <>
              Áp dụng từ {format(new Date(shift.effectiveFrom), 'dd/MM/yyyy')} →{' '}
              {format(new Date(shift.effectiveTo), 'dd/MM/yyyy')}
            </>
          ) : (
            <>Áp dụng từ {format(new Date(shift.effectiveFrom), 'dd/MM/yyyy')}</>
          )}
        </div>
      </div>
    </div>
  );
}
