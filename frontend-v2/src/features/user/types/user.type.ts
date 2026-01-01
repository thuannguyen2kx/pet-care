import type { TGender, TMemberShipTier, TUserStatus } from '@/features/user/domain/user-status';
import type { TRole } from '@/shared/constant';

type TCustomerInfo = {
  preferredEmployeeId?: string;
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };

  loyaltyPoints: number;
  membershipTier: TMemberShipTier;
  memberSince: string;

  stats: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    noShowCount: number;
    totalSpent: number;
    averageRating: number;
    lastBookingDate?: string;
  };

  isVip: boolean;
  hasOutstandingBalance: boolean;
  internalNotes?: string;
};

type TEmployeeInfo = {
  specialties: string[];
  certifications?: string[];
  experience?: string[];

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

  hireDate: Date;
  employeeId?: string;
  department?: string;

  isAcceptingBookings: boolean;
  maxDailyBookings: number;
  vacationMode: boolean;
};

export type TProfile = {
  _id: string;
  // Basic Info
  email: string;
  password?: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender: TGender;
  address?: {
    province: string;
    ward: string;
  };
  profilePicture?: {
    url: string | null;
    publicId: string | null;
  };
  // Role & status
  role: TRole;
  status: TUserStatus;

  // Role specific data
  customerInfo: TCustomerInfo;
  employeeInfo?: TEmployeeInfo;

  // Security
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  // Session
  lastLogin?: Date;
  lastLoginIp?: string;
  lastActiveAt?: Date;
  // Meta data
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
};
