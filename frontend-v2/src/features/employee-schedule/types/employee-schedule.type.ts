import type { TEmployeeDetail } from '@/features/employee/types';

export type TShiftTemplate = {
  _id: string;
  employeeId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  effectiveFrom: string;
  effectiveTo: null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TShiftOverride = {
  _id: string;
  employeeId: string;
  date: string;
  isWorking: boolean;
  reason: string;
  createdBy: {
    _id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type TBreakTemplate = {
  _id: string;
  employeeId: string;
  startTime: string;
  endTime: string;
  dateOfWeek?: number;
  name: string;
  effectiveFrom: string;
  effectiveTo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
export type TGetEmployeeDetail = {
  employee: TEmployeeDetail;
  schedule: {
    shifts: TShiftTemplate[];
    breaks: TBreakTemplate[];
    overrides: TShiftOverride[];
  };
};
