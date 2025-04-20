import { useQuery } from "@tanstack/react-query";
import { getUserByIdQueryFn } from "@/features/user/api";

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: () => getUserByIdQueryFn(userId),
    enabled: !!userId,
  });
};