import { useQuery } from "@tanstack/react-query";
import { employeeKeys } from "@/features/employee/query-key";
import { getEmployeeScheduleQueryFn } from "@/features/employee/api";

// Get employee schedule
export const useGetEmployeeSchedule = (
  id: string,
  params?: { startDate?: string; endDate?: string }
) => {
  return useQuery({
    queryKey: employeeKeys.schedule(id, params || {}),
    queryFn: () => getEmployeeScheduleQueryFn(id, params),
  });
};