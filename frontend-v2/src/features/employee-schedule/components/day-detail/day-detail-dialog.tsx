import { StatusBadge } from '@/features/employee-schedule/components/day-detail/status-badge';
import type { TCalendarDayWithSchedule } from '@/features/employee-schedule/domain/calendar-day-with-schedule.type';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

type Props = {
  day: TCalendarDayWithSchedule | null;
  onClose: () => void;
};

export function DayDetailDialog({ day, onClose }: Props) {
  if (!day) return null;

  const schedule = day.schedule;

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
          <div className="space-y-2">
            <StatusBadge schedule={schedule} />

            {schedule.isWorking ? (
              <>
                {/* <TimeRow label="Giờ làm" value={`${schedule.startTime} – ${schedule.endTime}`} /> */}

                {schedule.breaks.length > 0 && (
                  <div>
                    <p className="font-medium">Nghỉ giữa giờ</p>
                    <ul className="text-sm">
                      {schedule.breaks.map((b, i) => (
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
              <p className="text-xs text-orange-500">Override: {schedule.reason}</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
