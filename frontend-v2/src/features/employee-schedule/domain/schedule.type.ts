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

export type TWorkDaySchedule = {
  date: string; // YYYY-MM-DD (calendar date)
  dayOfWeek: TDayOfWeek;

  isWorking: boolean;

  startTime?: string;
  endTime?: string;

  breaks: TScheduleBreak[];

  override?: {
    reason?: string;
  };
};
export type TEmployeeWeekSchedule = {
  employeeId: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  specialties: string[];

  workHours: {
    start: string;
    end: string;
  };

  days: TWorkDaySchedule[];
};
export type TTeamWeekScheduleResponse = {
  period: {
    startDate: string; // ISO
    endDate: string; // ISO
  };
  employees: TEmployeeWeekSchedule[];
};
