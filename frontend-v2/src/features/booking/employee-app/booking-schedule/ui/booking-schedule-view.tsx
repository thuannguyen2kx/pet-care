import { EmployeeTodayBookingsWidget } from '@/features/booking/employee-app/booking-schedule/widgets/today-bookings-widget';
import { TodaySummary } from '@/features/booking/employee-app/booking-schedule/widgets/today-summar';
import { WeekScheduleWidget } from '@/features/booking/employee-app/booking-schedule/widgets/week-schedule-widget';

type Props = {
  onViewDetail: (bookingId: string) => void;
};
export function EmployeeBookingScheduleView({ onViewDetail }: Props) {
  return (
    <>
      <TodaySummary />
      <WeekScheduleWidget onViewDetail={onViewDetail} />
      <EmployeeTodayBookingsWidget onViewDetail={onViewDetail} />
    </>
  );
}
