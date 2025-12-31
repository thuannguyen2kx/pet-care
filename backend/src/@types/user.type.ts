import { RoleType } from "../enums/role.enum";
import { UserStatusType } from "../enums/status-user.enum";

export type UserIdentityDTO = {
  id: string;
  role: RoleType;
  status: UserStatusType;
};

export type UserProfileDTO = {
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  phoneNumber?: string;
};

export type EmployeeDomainDTO = {
  type: "employee";
  specialties: string[];
  status: string;
  isAcceptingBookings: boolean;
};

export type CustomerDomainDTO = {
  type: "customer";
  membershipTier: string;
  loyaltyPoints: number;
  isVip: boolean;
};

export type UserDomainDTO = EmployeeDomainDTO | CustomerDomainDTO;

export type GetMeResponseDTO = {
  identity: UserIdentityDTO;
  profile: UserProfileDTO;
  domain?: UserDomainDTO;
};
