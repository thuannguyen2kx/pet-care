import { format } from 'date-fns';
import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router';

import { useEmployeeSchedule } from '@/features/employee-schedule/api/get-employee-schedule';
import type { TCalendarScheduleDay } from '@/features/employee-schedule/domain/schedule.type';
import { mapDateRangeToApiParams } from '@/features/employee-schedule/mappers/map-data-range-to-api';
import { mapScheduleToCalendarDays } from '@/features/employee-schedule/mappers/map-schedule-to-calendar-day';
import { EmployeeSchedulePrecenter } from '@/features/employee-schedule/precenters/employee-schedule-precenter';
import { getApiDateRange } from '@/features/employee-schedule/utils/get-api-date-range';
import { parseScheduleSearch } from '@/features/employee-schedule/utils/parse-schedule-search';

export default function EmploeeScheduleContainer() {
  const params = useParams();
  const employeeId = params.employeeId as string;
  // const [cursorDate, setCursorDate] = useState(() => new Date());
  // const range = getDateRange(cursorDate, view);
  // const { startDate, endDate } = mapDateRangeToApiParams(range);
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

  const scheduleDays = useMemo<TCalendarScheduleDay[]>(() => {
    return mapScheduleToCalendarDays(employeeScheduleQuery.data?.data || []);
  }, [employeeScheduleQuery.data?.data]);

  return (
    <EmployeeSchedulePrecenter
      view={view}
      days={scheduleDays}
      date={date}
      isLoading={employeeScheduleQuery.isLoading}
      onChangeMonth={onChangeMonth}
    />
  );
}
