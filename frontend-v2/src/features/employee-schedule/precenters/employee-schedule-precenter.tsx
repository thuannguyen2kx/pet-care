import { format } from 'date-fns';
import { useSearchParams } from 'react-router';

import { CalendarHeader } from '@/features/employee-schedule/components/calendar/calendar-header';
import { MonthGrid } from '@/features/employee-schedule/components/calendar/month-view/month-grid';
import { WeekGrid } from '@/features/employee-schedule/components/calendar/week-view/week-grid';
import type { TCalendarViewMode } from '@/features/employee-schedule/domain/date-range';
import type { TCalendarScheduleDay } from '@/features/employee-schedule/domain/schedule.type';

export function EmployeeSchedulePrecenter(props: {
  view: TCalendarViewMode;
  days: TCalendarScheduleDay[];
  date: Date;
  isLoading: boolean;
  onChangeMonth: (date: Date) => void;
  // onViewChange: (v: TCalendarViewMode) => void;
  // onNavigate: (d: Date) => void;
}) {
  const [, setSearchParams] = useSearchParams();
  return (
    <div className="space-y-4">
      <CalendarHeader
        view={props.view}
        date={props.date}
        onChangeDate={(nextDate) => {
          setSearchParams({
            view: props.view,
            date: format(nextDate, 'yyyy-MM-dd'),
          });
        }}
        onChangeView={(nextView) => {
          setSearchParams({
            view: nextView,
            date: format(props.date, 'yyyy-MM-dd'),
          });
        }}
      />

      {props.view === 'month' ? (
        <MonthGrid cursorDate={props.date} days={props.days} />
      ) : (
        <WeekGrid cursorDate={props.date} days={props.days} />
      )}
    </div>
  );
}
