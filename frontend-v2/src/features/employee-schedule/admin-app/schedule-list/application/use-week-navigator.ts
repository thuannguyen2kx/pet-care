import { addDays, format, parseISO, startOfWeek } from 'date-fns';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

export function useWeekNavigator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const weekParam = searchParams.get('week');

  const weekStart = useMemo(() => {
    const baseDate = weekParam ? parseISO(weekParam) : new Date();

    return startOfWeek(baseDate, { weekStartsOn: 1 });
  }, [weekParam]);

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const navigateWeek = (type: 'prev' | 'next' | 'today') => {
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
      prev.set('week', format(target, 'yyyy-MM-dd'));
      return prev;
    });
  };

  return {
    weekStart,
    weekDates,
    navigateWeek,
  };
}
