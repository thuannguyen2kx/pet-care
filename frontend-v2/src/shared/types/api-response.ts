import type { TRole } from '../constant/roles';

import type { MembershipTier } from '@/features/customer/domain/customer-entity';
import type { UserStatus } from '@/features/user/domain/user.entity';

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
export type TUserIdentity = {
  id: string;
  role: TRole;
  status: UserStatus;
};
export type TUserProfile = {
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  phoneNumber?: string;
};

export type TEmployeeDomain = {
  type: 'employee';
  specialties: string[];
  status: string;
  isAcceptingBookings: boolean;
};

export type TCustomerDomain = {
  type: 'customer';
  membershipTier: MembershipTier;
  loyaltyPoints: number;
  isVip: boolean;
};

export type TUserDomain = TEmployeeDomain | TCustomerDomain;

export type TGetMeResponse = {
  identity: TUserIdentity;
  profile: TUserProfile;
  domain: TUserDomain;
};
