import { useMemo } from 'react';

import type { BookingScheduleDay } from '@/features/booking/domain/booking.entity';
import { DayColumn } from '@/features/booking/employee-app/booking-schedule/ui/week-schedule/day-cols';

const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
export function WeekGrid({
  weekDates,
  days,
  onViewDetail,
}: {
  weekDates: Date[];
  days: BookingScheduleDay[];
  onViewDetail: (bookingId: string) => void;
}) {
  const bookingsMap = useMemo(() => {
    return Object.fromEntries(days.map((d) => [d.dayOfWeek, d.bookings]));
  }, [days]);

  const getBookingsForDate = (day: number) => bookingsMap[day] ?? [];
  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDates.map((date, dateOfWeek) => (
        <DayColumn
          key={date.toISOString()}
          date={date}
          dayName={dayNames[dateOfWeek]}
          bookings={getBookingsForDate(dateOfWeek)}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
}
