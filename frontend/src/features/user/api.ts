import API from "@/lib/axios-client"

import { CurrentUserResponseType } from "./types/api.types"

export const getCurrentUserQueryFn = async (): Promise<CurrentUserResponseType> => {
  const response = await API.get("/user/current")
  return response.data
}