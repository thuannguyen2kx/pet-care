import type { TCalendarScheduleDay } from '@/features/employee-schedule/domain/schedule.type';
import { Badge } from '@/shared/ui/badge';

export function StatusBadge({ schedule }: { schedule: TCalendarScheduleDay }) {
  if (schedule.override) {
    return <Badge variant="destructive">Lịch điều chỉnh</Badge>;
  }
  if (!schedule.isWorking) {
    return <Badge variant="destructive">Nghỉ</Badge>;
  }

  return <Badge>Đang làm</Badge>;
}
