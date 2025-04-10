import {Specialty, StatusUserType } from "@/constants";

export type EmployeeType = {
  _id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: string;
  status: StatusUserType;
  profilePicture?: {
    url: string | null;
    publicId: string | null;
  };
  employeeInfo: {
    specialties: Specialty[];
    schedule: {
      workDays: string[];
      workHours: {
        start: string;
        end: string;
      };
    };
    performance: {
      rating: number;
      completedServices: number;
    };
  };
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Types for creating/updating employees
export type CreateEmployeeDTO  ={
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  specialties: string[];
  workDays: string[];
  workHoursStart?: string;
  workHoursEnd?: string;
}

export type UpdateEmployeeDTO  = {
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  specialties?: Specialty[];
  workDays?: string[];
  workHoursStart?: string;
  workHoursEnd?: string;
  status?: StatusUserType;
}

export type GetEmployeePerformanceResponse = {
  message: string;

  totalAppointments: number;
  serviceBreakdown: Record<string, number>;
  monthlyPerformance: {
    year: number;
    month: number;
    count: number;
  }[];
  completedServices: number;
  rating: number;
};
export type GetEmployeeScheduleType = {
  message: string;
  workDays: string[];
  workHours: { start: string; end: string };
  appointments: {
    _id: string;
    date: string;
    timeSlot: {
      start: string;
      end: string;
    };
    status: string;
    service: { name: string; duration: string };
    customer: {
      fullName: string;
      phoneNumber: string;
    };
    pet: {
      name: string;
      species: string
    };
  }[];
};