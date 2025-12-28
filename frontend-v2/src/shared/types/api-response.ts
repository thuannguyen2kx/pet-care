import type { TRole } from '../constant/roles';
import type { TGender, TStatusUser } from '../constant/status-user';

type TApiResponseSuccess<T> = {
  status: number;
  message: string;
  data: T;
};

type TApiResponseError = {
  status: number;
  message: string;
  errorCode: string;
  errors?: unknown;
};
export type { TApiResponseSuccess, TApiResponseError };

// ======================== USER =============================
export type TUser = {
  _id: string;
  email: string;
  password?: string;
  fullName: string;
  phoneNumber?: string;
  gender: TGender;
  role: TRole;
  status: TStatusUser;
  profilePicture: {
    url: string | null;
    publicId: string | null;
  };
  employeeInfo: TEmployeeInfo | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// ======================== EMPLOYEE =============================
export type TEmployeeInfo = {
  specialties?: string[];
  schedule?: {
    workDays: string[];
    workHours: {
      start: string;
      end: string;
    };
    vacation?: { start: Date; end: Date }[];
  };
  performance?: {
    rating: number;
    completedServices: number;
  };
};
