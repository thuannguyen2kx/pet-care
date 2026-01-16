import { format } from 'date-fns';

import { useEmployeeBookingSchedule } from '@/features/booking/api/get-booking-schedule';
import { useWeekNavigator } from '@/features/booking/employee-app/booking-schedule/application/use-week-navigation';
import { BookingStatusLegend } from '@/features/booking/employee-app/booking-schedule/ui/week-schedule/booking-status-legend';
import { ScheduleHeader } from '@/features/booking/employee-app/booking-schedule/ui/week-schedule/schedule-header';
import { WeekGrid } from '@/features/booking/employee-app/booking-schedule/ui/week-schedule/week-grid';
import { SectionSpinner } from '@/shared/components/template/loading';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';

type Props = {
  onViewDetail: (bookingId: string) => void;
};
export function WeekScheduleWidget({ onViewDetail }: Props) {
  const { weekDates, weekRangeLabel, isCurrentWeek, weekStart, goToWeek } = useWeekNavigator();
  const bookingsQuery = useEmployeeBookingSchedule({
    query: { date: format(weekStart, 'yyyy-MM-dd') },
  });
  return (
    <Card className="mb-6 rounded-none border-none p-4 shadow-none">
      <CardHeader className="pb-2">
        <ScheduleHeader
          isCurrentWeek={isCurrentWeek}
          weekRangeLabel={weekRangeLabel}
          onNext={() => goToWeek('next')}
          onPrev={() => goToWeek('prev')}
          onToday={() => goToWeek('today')}
        />
      </CardHeader>

      <CardContent>
        {bookingsQuery.isLoading ? (
          <SectionSpinner />
        ) : (
          <WeekGrid
            weekDates={weekDates}
            days={bookingsQuery.data ?? []}
            onViewDetail={onViewDetail}
          />
        )}
      </CardContent>

      <BookingStatusLegend />
    </Card>
  );
}
