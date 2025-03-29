import { RolesType, StatusUserType } from "@/constants"

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
  profilePicture: string | null,
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