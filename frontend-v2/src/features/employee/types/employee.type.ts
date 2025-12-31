import type { TRole, TUserStatus } from '@/shared/constant';

export type TEmployeeListQueryParams = {
  specialty?: string;
  isAcceptingBookings?: boolean;
  page?: number;
  limit?: number;
};

export type TEmployeeListItem = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;

  role: TRole;
  status: TUserStatus;

  profilePicture?: {
    url: string | null;
  };

  employeeInfo: {
    specialties: string[];
    hourlyRate?: number;
    commissionRate?: number;

    stats: {
      rating: number;
      totalBookings: number;
      completedBookings: number;
    };

    isAcceptingBookings: boolean;
    vacationMode: boolean;
    maxDailyBookings: number;
  };

  createdAt: string;
};

export type TGetEmployeeListResponse = {
  employees: TEmployeeListItem[];
  total: number;
  pages: number;
};

export type TEmployeeDetail = {
  _id: string;

  // Basic
  fullName: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;

  address?: {
    province: string;
    ward: string;
  };

  profilePicture?: {
    url: string | null;
  };

  role: TRole;
  status: TUserStatus;

  // Employee Info (FULL)
  employeeInfo: {
    specialties: string[];
    certifications?: string[];
    experience?: string;

    hourlyRate?: number;
    commissionRate?: number;

    defaultSchedule: {
      workDays: number[];
      workHours: {
        start: string;
        end: string;
      };
    };

    stats: {
      rating: number;
      totalBookings: number;
      completedBookings: number;
      cancelledBookings: number;
      noShowRate: number;
      totalRevenue: number;
      averageServiceTime: number;
    };

    hireDate: string;
    employeeId?: string;
    department?: string;

    isAcceptingBookings: boolean;
    maxDailyBookings: number;
    vacationMode: boolean;
  };

  // Meta
  createdAt: string;
  updatedAt: string;
};
