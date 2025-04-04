import { useSuspenseQuery } from "@tanstack/react-query";
import { employeeKeys } from "@/features/employee/query-key";
import { getAllEmployeesQueryFn } from "@/features/employee/api";
import { StatusUserType } from "@/constants";

// Get all employees (with optional filters)
export const useGetEmployees = (filters?: {
  status?: StatusUserType;
  specialty?: string;
}) => {
  return useSuspenseQuery({
    queryKey: employeeKeys.list(filters || {}),
    queryFn: () => getAllEmployeesQueryFn(filters),
  });
};
