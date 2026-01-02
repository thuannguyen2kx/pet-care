/**
 * Day of week (JS standard)
 * 0 = Sunday, 6 = Saturday
 */
export type TDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Break inside a working day
 */
export type TScheduleBreak = {
  name: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
};
export type TEmployeeScheduleDay = Omit<TCalendarScheduleDay, 'date'> & { date: string };

export type TCalendarScheduleDay = {
  date: Date;
  dayOfWeek: TDayOfWeek;
  isWorking: boolean;

  startTime?: string;
  endTime?: string;

  breaks: {
    name: string;
    startTime: string;
    endTime: string;
  }[];

  override?: boolean;
  reason?: string;
};
