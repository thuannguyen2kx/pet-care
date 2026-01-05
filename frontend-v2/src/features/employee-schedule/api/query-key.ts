export const employeeScheduleKeys = {
  schedule: ['schedule'],
  detail: (employeeId: string, startDate?: string, endDate?: string) => [
    ...employeeScheduleKeys.schedule,
    employeeId,
    startDate,
    endDate,
  ],
  employeeDetail: (employeeId: string) => [
    ...employeeScheduleKeys.schedule,
    'employee',
    employeeId,
  ],
  teamSchedule: (startDate?: string, endDate?: string) => [
    ...employeeScheduleKeys.schedule,
    'team',
    startDate,
    endDate,
  ],
};
