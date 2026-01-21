import { format } from 'date-fns';
import { useSearchParams } from 'react-router';

import { CalendarHeader } from '@/features/employee-schedule/admin-app/employee-schedule/ui/calendar/calendar-header';
import { MonthGrid } from '@/features/employee-schedule/admin-app/employee-schedule/ui/calendar/month-view/month-grid';
import { WeekGrid } from '@/features/employee-schedule/admin-app/employee-schedule/ui/calendar/week-view/week-grid';
import type { EmployeeScheduleCalendar } from '@/features/employee-schedule/domain/schedule.entity';
import type { CalendarViewMode } from '@/features/employee-schedule/domain/schedule.lib';

export function EmployeeScheduleView(props: {
  view: CalendarViewMode;
  days: EmployeeScheduleCalendar[];
  date: Date;
  isLoading: boolean;
  onChangeMonth: (date: Date) => void;
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
