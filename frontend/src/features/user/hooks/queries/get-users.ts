import { useQuery } from "@tanstack/react-query";
import { getAllCustomerQueryFn } from "@/features/user/api";
import { UserFilters } from "@/features/user/types/api.types";

export const useGetCustomers = (filters: UserFilters) => {
  return useQuery({
    queryKey: ["admin", "customers", filters],
    queryFn: () => getAllCustomerQueryFn(filters),
  });
};
