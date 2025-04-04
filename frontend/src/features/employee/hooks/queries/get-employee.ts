import { useSuspenseQuery } from "@tanstack/react-query";
import { employeeKeys } from "@/features/employee/query-key";
import { getEmployeeByIdQueryFn } from "@/features/employee/api";

// Get employee by ID
export const useGetEmployee = (id: string) => {
  
  return useSuspenseQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => getEmployeeByIdQueryFn(id),
  });
};