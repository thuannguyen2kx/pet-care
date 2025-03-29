import API from "@/lib/axios-client";
import { LoginResponseType, loginType, registerType } from "./types/api.types";

export const loginMutationFn = async (data: loginType): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data)
  
  return response.data
}

export const registerMutationFn = async(data: registerType) => {
  const response  = await API.post("/auth/register", data)

  return response.data
}

export const logoutMutationFn = async() => {
  return await API.post("/auth/logout")
}