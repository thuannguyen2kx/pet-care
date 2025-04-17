import { useQuery } from "@tanstack/react-query";
import { getUserPaymentsQueryFn } from "../api";

export const useGetUserPayments = () => {
  return useQuery({
    queryKey: ['payments', 'user'],
    queryFn: getUserPaymentsQueryFn,
    staleTime: 1000 * 60 * 5
  });
};