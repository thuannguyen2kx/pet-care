import { DayDetailDialog } from '@/features/employee-schedule/admin-app/employee-schedule/dialog/day-detail/day-detail-dialog';
import { useDayDetailPresenter } from '@/features/employee-schedule/admin-app/employee-schedule/dialog/day-detail/use-day-detail-precenter';
import { MonthHeader } from '@/features/employee-schedule/admin-app/employee-schedule/ui/calendar/month-view/month-header';
import { MonthCell } from '@/features/employee-schedule/admin-app/employee-schedule/ui/calendar/month-view/moth-cell';
import type { EmployeeScheduleCalendar } from '@/features/employee-schedule/domain/schedule.entity';
import {
  attachScheduleToCalendarMatrix,
  buildMonthMatrix,
} from '@/features/employee-schedule/domain/schedule.lib';

type Props = {
  cursorDate: Date;
  days: EmployeeScheduleCalendar[];
};
const WEEK_DAYS_MON = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export function MonthGrid({ cursorDate, days }: Props) {
  const presenter = useDayDetailPresenter();
  const matrix = buildMonthMatrix(cursorDate);
  const calendar = attachScheduleToCalendarMatrix(matrix, days);

  return (
    <>
      <div className="bg-card border-border overflow-hidden rounded-lg border">
        <MonthHeader days={WEEK_DAYS_MON} />

        <div className="grid grid-cols-7 gap-px">
          {calendar.flat().map((day) => (
            <MonthCell
              key={day.date.toISOString()}
              day={day}
              onClick={() => presenter.openDayDetail(day)}
            />
          ))}
        </div>
      </div>

      <DayDetailDialog day={presenter.selectedDay} onClose={presenter.closeDayDetail} />
    </>
  );
}
