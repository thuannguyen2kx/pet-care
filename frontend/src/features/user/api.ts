import API from "@/lib/axios-client";

import {
  CurrentUserResponseType,
  GetAllCustomerResType,
  ProfileResponseType,
  updateProfileInfoType,
  UserFilters,
  UserType,
} from "./types/api.types";
import { Roles, StatusUserType } from "@/constants";

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    const response = await API.get("/user/current");
    return response.data;
  };
export const getProfileByIdQueryFn = async (
  id: string
): Promise<ProfileResponseType> => {
  const response = await API.get(`/user/profile/${id}`);
  return response.data;
};
export const updateProfileInfoMutationFn = async (
  data: updateProfileInfoType
): Promise<ProfileResponseType> => {
  const response = await API.put("/user/profile", data);
  return response.data;
};
export const updateProfilePictureMutationFn = async (
  data: FormData
): Promise<ProfileResponseType> => {
  const response = await API.put("/user/profile/picture", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllCustomerQueryFn = async (
  filters: UserFilters
): Promise<GetAllCustomerResType> => {
  const queryParams = new URLSearchParams();

  if (filters.search) queryParams.append("search", filters.search);
  if (filters.status) queryParams.append("status", filters.status);
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());
  queryParams.append("role", Roles.CUSTOMER); // Always filter by CUSTOMER role

  const response = await API.get(`/user?${queryParams.toString()}`);
  return response.data;
};
export const getUserByIdQueryFn = async (
  userId: string
): Promise<{ message: string; user: UserType }> => {
  const response = await API.get(`/user/${userId}`);
  return response.data;
};
export const changeUserStatusMutationFn = async ({
  userId,
  status,
}: {
  userId: string;
  status: StatusUserType;
}) => {
  const response = await API.patch(`/user/${userId}/status`, { status });
  return response.data;
};
