import { StatusBadge } from '@/features/employee-schedule/admin-app/employee-schedule/dialog/day-detail/status-badge';
import type { CalendarDayWithSchedule } from '@/features/employee-schedule/domain/schedule.entity';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

type Props = {
  day: CalendarDayWithSchedule | null;
  onClose: () => void;
};

export function DayDetailDialog({ day, onClose }: Props) {
  if (!day) return null;

  const schedule = day.schedule;
  const hasBreaks = !!schedule?.breaks?.length;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {day.date.toLocaleDateString('vi-VN', {
              weekday: 'long',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </DialogTitle>
        </DialogHeader>

        {!schedule && <p className="text-muted-foreground">Không có lịch làm việc</p>}

        {schedule && (
          <div className="space-y-3">
            <StatusBadge schedule={schedule} />

            {schedule.isWorking ? (
              <>
                <p className="text-sm">
                  <span className="font-medium">Giờ làm:</span> {schedule.startTime} –{' '}
                  {schedule.endTime}
                </p>

                {hasBreaks && (
                  <div>
                    <p className="text-sm font-medium">Nghỉ giữa giờ</p>
                    <ul className="ml-4 list-disc text-sm">
                      {schedule.breaks!.map((b, i) => (
                        <li key={i}>
                          {b.name}: {b.startTime} – {b.endTime}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-sm">Ngày nghỉ</p>
            )}

            {schedule.override && (
              <div className="text-destructive text-xs">
                <span className="font-medium">Lịch điều chỉnh</span>
                {schedule.reason && `: ${schedule.reason}`}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
