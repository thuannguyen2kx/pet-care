import type { TCalendarScheduleDay } from '@/features/employee-schedule/domain/schedule.type';
import { Badge } from '@/shared/ui/badge';

export function StatusBadge({ schedule }: { schedule: TCalendarScheduleDay }) {
  if (!schedule.isWorking) {
    return <Badge variant="secondary">Nghỉ</Badge>;
  }

  if (schedule.override) {
    return <Badge variant="destructive">Override</Badge>;
  }

  return <Badge>Đang làm</Badge>;
}
