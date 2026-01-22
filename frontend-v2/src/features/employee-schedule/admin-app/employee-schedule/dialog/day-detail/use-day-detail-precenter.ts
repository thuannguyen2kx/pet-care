import { useState } from 'react';

import type { CalendarDayWithSchedule } from '@/features/employee-schedule/domain/schedule.entity';

export function useDayDetailPresenter() {
  const [selectedDay, setSelectedDay] = useState<CalendarDayWithSchedule | null>(null);

  return {
    selectedDay,
    openDayDetail: (day: CalendarDayWithSchedule) => setSelectedDay(day),
    closeDayDetail: () => setSelectedDay(null),
  };
}
