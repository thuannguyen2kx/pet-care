import { GenderType, RolesType, StatusUserType } from "@/constants"

export type EmployeeInfoType = {
  specialties?: string[],
  schedule?: {
    workDays: string[],
    workHours: {
      start: string,
      end: string
    }
  },
  performance?: {
    rating: number,
    completedServices: number
  }
}
export type UserType = {
  _id: string,
  fullName: string,
  email: string,
  profilePicture: {
    url: string | null,
    publicId: string | null
  },
  phoneNumber?: string | null,
  gender: GenderType,
  role: RolesType,
  status: StatusUserType,
  employeeInfo: EmployeeInfoType | null,
  lastLogin: string | null,
  createdAt: string,
  updatedAt: string, 
}
export type CurrentUserResponseType = {
  message: string,
  user: UserType
}
export type ProfileResponseType = {
  message: string,
  user: UserType
}

export type updateProfileInfoType = {
  fullName?: string,
  phoneNumber?: string,
  email?: string,
  gender?: string
}
export type UpdateProfileResponseType = {
  message: string,
  user: UserType
}

export type UserFilters = {
  search?: string;
  status?: StatusUserType | undefined;
  page?: number;
  limit?: number;
}
export type GetAllCustomerResType = {
  message: string;
  users: UserType[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
};