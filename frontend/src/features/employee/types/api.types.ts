import { SpecialtyType, StatusUserType } from "@/constants";

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
    specialties: SpecialtyType[];
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
  specialties?: SpecialtyType[];
  workDays?: string[];
  workHoursStart?: string;
  workHoursEnd?: string;
  status?: StatusUserType;
}