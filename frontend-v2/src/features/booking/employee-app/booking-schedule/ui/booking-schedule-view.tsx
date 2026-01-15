import { TodaySummary } from '@/features/booking/employee-app/booking-schedule/widgets/today-summar';
import { WeekScheduleWidget } from '@/features/booking/employee-app/booking-schedule/widgets/week-schedule-widget';

export function EmployeeBookingScheduleView() {
  return (
    <>
      <TodaySummary />
      <WeekScheduleWidget />
    </>
  );
}
