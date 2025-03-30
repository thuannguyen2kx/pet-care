import API from "@/lib/axios-client"

import { CurrentUserResponseType, ProfileResponseType, updateProfileInfoType } from "./types/api.types"

export const getCurrentUserQueryFn = async (): Promise<CurrentUserResponseType> => {
  const response = await API.get("/user/current")
  return response.data
}
export const getProfileByIdQueryFn = async(id: string): Promise<ProfileResponseType> => {
  const response = await API.get(`/user/profile/${id}`)
  return response.data
}
export const updateProfileInfoMutationFn = async(data: updateProfileInfoType ): Promise<ProfileResponseType> => {
  const response = await API.put("/user/profile", data)
  return response.data
}
export const updateProfilePictureMutationFn = async(data: FormData): Promise<ProfileResponseType> => {
  const response = await API.put("/user/profile/picture", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  return response.data
}