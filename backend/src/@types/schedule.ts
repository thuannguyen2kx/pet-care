interface WeekScheduleResponse {
  employeeId: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  specialties: string[];
  workHours: {
    start: string;
    end: string;
  };
  weekSchedule: {
    [dayOfWeek: number]: {
      isWorking: boolean;
      startTime?: string;
      endTime?: string;
      breaks: Array<{
        name: string;
        startTime: string;
        endTime: string;
      }>;
      override?: {
        reason: string;
        isWorking: boolean;
      };
    };
  };
}

interface TeamScheduleQuery {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  specialty?: string;
  employeeIds?: string[];
}
