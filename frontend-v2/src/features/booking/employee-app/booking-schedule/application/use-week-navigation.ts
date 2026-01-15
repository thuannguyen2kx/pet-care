import { addDays, format, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

export function useWeekNavigator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const weekParam = searchParams.get('date');

  /**
   * Week start (Monday, local time)
   */
  const weekStart = useMemo(() => {
    const baseDate = weekParam ? parseISO(weekParam) : new Date();
    return startOfWeek(baseDate, { weekStartsOn: 1 });
  }, [weekParam]);

  /**
   * Week end (Sunday)
   */
  const weekEnd = useMemo(() => {
    return endOfWeek(weekStart, { weekStartsOn: 1 });
  }, [weekStart]);

  /**
   * 7 dates for grid
   */
  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  /**
   * Display range: "08/01 - 14/01"
   */
  const weekRangeLabel = useMemo(() => {
    return `${format(weekStart, 'dd/MM')} - ${format(weekEnd, 'dd/MM')}`;
  }, [weekStart, weekEnd]);

  /**
   * Navigation
   */
  const goToWeek = (type: 'prev' | 'next' | 'today') => {
    let target: Date;

    switch (type) {
      case 'today':
        target = new Date();
        break;
      case 'prev':
        target = addDays(weekStart, -7);
        break;
      case 'next':
        target = addDays(weekStart, 7);
        break;
    }

    setSearchParams((prev) => {
      prev.set('date', format(target, 'yyyy-MM-dd'));
      return prev;
    });
  };

  /**
   * Is current week?
   */
  const isCurrentWeek = !weekParam;

  return {
    weekStart,
    weekEnd,
    weekDates,
    weekRangeLabel,
    isCurrentWeek,
    goToWeek,
  };
}
