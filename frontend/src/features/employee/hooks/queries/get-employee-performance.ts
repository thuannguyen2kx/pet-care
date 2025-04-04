import { useQuery } from "@tanstack/react-query";
import { employeeKeys } from "@/features/employee/query-key";
import { getEmployeePerformanceQueryFn } from "@/features/employee/api";

// Get employee performance
export const useEmployeePerformance = (id: string) => {
  return useQuery({
    queryKey: employeeKeys.performance(id),
    queryFn: () => getEmployeePerformanceQueryFn(id),
  });
};