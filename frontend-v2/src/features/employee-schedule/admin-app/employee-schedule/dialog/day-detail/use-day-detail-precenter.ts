import { useState } from 'react';

import type { TCalendarDayWithSchedule } from '@/features/employee-schedule/domain/calendar-day-with-schedule.type';

export function useDayDetailPresenter() {
  const [selectedDay, setSelectedDay] = useState<TCalendarDayWithSchedule | null>(null);

  return {
    selectedDay,
    openDayDetail: (day: TCalendarDayWithSchedule) => setSelectedDay(day),
    closeDayDetail: () => setSelectedDay(null),
  };
}
