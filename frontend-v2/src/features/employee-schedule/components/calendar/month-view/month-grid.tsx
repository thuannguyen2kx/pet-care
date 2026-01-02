import { MonthCell } from '@/features/employee-schedule/components/calendar/month-view/moth-cell';
import { DayDetailDialog } from '@/features/employee-schedule/components/day-detail/day-detail-dialog';
import { useDayDetailPresenter } from '@/features/employee-schedule/components/day-detail/use-day-detail-precenter';
import { buildMonthMatrix } from '@/features/employee-schedule/domain/build-month-matrix';
import type { TCalendarScheduleDay } from '@/features/employee-schedule/domain/schedule.type';
import { attachScheduleToCalendarMatrix } from '@/features/employee-schedule/mappers/attach-schedule-to-calendar-matrix';

type Props = {
  cursorDate: Date;
  days: TCalendarScheduleDay[];
};
export function MonthGrid({ cursorDate, days }: Props) {
  const presenter = useDayDetailPresenter();
  const matrix = buildMonthMatrix(cursorDate);
  const calendar = attachScheduleToCalendarMatrix(matrix, days);

  return (
    <>
      <div className="bg-muted grid grid-cols-7 gap-px rounded-lg border">
        {calendar.flat().map((day) => (
          <MonthCell
            key={day.date.toISOString()}
            day={day}
            onClick={() => presenter.openDayDetail(day)}
          />
        ))}
      </div>

      <DayDetailDialog day={presenter.selectedDay} onClose={presenter.closeDayDetail} />
    </>
  );
}
