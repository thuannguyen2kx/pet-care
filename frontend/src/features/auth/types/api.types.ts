import { RolesType } from "@/constants"

export type loginType = {
  email: string,
  password: string 
}
export type LoginResponseType = {
  message: string,
  access_token: string,
  user: {
    _id: string,
    role: RolesType
  }
}

export type registerType = {
  fullName: string,
  email: string,
  password: string
}

