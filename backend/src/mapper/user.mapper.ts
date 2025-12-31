import { GetMeResponseDTO } from "../@types/user.type";
import { Roles } from "../enums/role.enum";
import { UserDocument } from "../models/user.model";

function getUserDisplayName(user: { fullName?: string; email: string }) {
  return user.fullName || user.email.split("@")[0];
}

export function mapUserToGetMeResponse(user: UserDocument): GetMeResponseDTO {
  const base: GetMeResponseDTO = {
    identity: {
      id: user._id.toString(),
      role: user.role,
      status: user.status,
    },
    profile: {
      email: user.email,
      displayName: getUserDisplayName({
        fullName: user.fullName,
        email: user.email,
      }),
      avatarUrl: user.profilePicture?.url ?? null,
      phoneNumber: user.phoneNumber,
    },
  };

  if (user.role === Roles.EMPLOYEE || user.role === Roles.ADMIN) {
    return {
      ...base,
      domain: {
        type: "employee",
        specialties: user.employeeInfo?.specialties ?? [],
        status: user.employeeInfo?.isAcceptingBookings
          ? "AVAILABLE"
          : "UNAVAILABLE",
        isAcceptingBookings: user.employeeInfo?.isAcceptingBookings ?? false,
      },
    };
  }

  if (user.role === Roles.CUSTOMER) {
    return {
      ...base,
      domain: {
        type: "customer",
        membershipTier: user.customerInfo.membershipTier,
        loyaltyPoints: user.customerInfo.loyaltyPoints,
        isVip: user.customerInfo.isVip,
      },
    };
  }

  return base;
}
