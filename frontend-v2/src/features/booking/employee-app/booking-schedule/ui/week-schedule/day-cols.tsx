import { isToday } from 'date-fns';

import type { Booking, BookingScheduleDay } from '@/features/booking/domain/booking.entity';
import { BookingItem } from '@/features/booking/employee-app/booking-schedule/ui/week-schedule/booking-item';
import { cn } from '@/shared/lib/utils';

export function DayColumn({
  date,
  dayName,
  bookings,
  onViewDetail,
}: {
  date: Date;
  dayName: string;
  bookings: Booking[];
  onViewDetail: (bookingId: string) => void;
}) {
  const isTodayDate = isToday(date);

  return (
    <div
      className={cn(
        'min-h-50 rounded-xl p-3 transition-colors',
        isTodayDate ? 'bg-primary/5 ring-primary/20 ring-2' : 'bg-muted/30 hover:bg-muted/50',
      )}
    >
      <div className="mb-3 text-center">
        <p className="text-muted-foreground text-xs">{dayName}</p>
        <p className={cn('text-lg font-semibold', isTodayDate && 'text-primary')}>
          {date.getDate()}
        </p>
      </div>

      <div className="space-y-2">
        {bookings.length > 0 ? (
          bookings.map((b) => <BookingItem key={b.id} booking={b} onViewDetail={onViewDetail} />)
        ) : (
          <p className="text-muted-foreground py-4 text-center text-xs">Trống</p>
        )}
      </div>
    </div>
  );
}
