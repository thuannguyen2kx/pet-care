import { format } from 'date-fns';
import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router';

import { EmployeeScheduleView } from '@/features/employee-schedule/admin-app/employee-schedule/ui/employee-schedule-view';
import { useEmployeeSchedule } from '@/features/employee-schedule/api/get-employee-schedule';
import {
  getApiDateRange,
  mapDateRangeToApiParams,
  parseScheduleSearch,
} from '@/features/employee-schedule/domain/schedule.lib';
import { mapEmployeeScheduleToCalendarDays } from '@/features/employee-schedule/domain/schedule.transform';

export default function EmployeeSchedulePage() {
  const params = useParams();
  const employeeId = params.employeeId as string;
  const [searchParams, setSearchParams] = useSearchParams();
  const { view, date } = parseScheduleSearch(searchParams);

  const range = getApiDateRange(date, view);
  const { startDate, endDate } = mapDateRangeToApiParams(range);

  const employeeScheduleQuery = useEmployeeSchedule({ employeeId, startDate, endDate });
  const onChangeMonth = (nextDate: Date) => {
    setSearchParams({
      view,
      date: format(nextDate, 'yyyy-MM-dd'),
    });
  };

  const scheduleDays = useMemo(() => {
    return mapEmployeeScheduleToCalendarDays(employeeScheduleQuery.data || []);
  }, [employeeScheduleQuery.data]);

  return (
    <EmployeeScheduleView
      view={view}
      days={scheduleDays}
      date={date}
      isLoading={employeeScheduleQuery.isLoading}
      onChangeMonth={onChangeMonth}
    />
  );
}
