// Output of buildMonthMatrix and buildWeekMatrix
export type TCalendarDay = {
  date: Date;

  /** UI concern */
  isToday: boolean;
  isCurrentMonth?: boolean;
};
