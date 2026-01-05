import { endOfWeek, format, parseISO, startOfWeek } from 'date-fns';

export function getWeekRangeFromParam(weekParam?: string) {
  const baseDate = weekParam ? parseISO(weekParam) : new Date();

  const start = startOfWeek(baseDate, { weekStartsOn: 1 });
  const end = endOfWeek(baseDate, { weekStartsOn: 1 });

  return {
    startDate: format(start, 'yyyy-MM-dd'),
    endDate: format(end, 'yyyy-MM-dd'),
    start,
    end,
  };
}
