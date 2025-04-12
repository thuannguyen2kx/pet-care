import { useQuery } from "@tanstack/react-query";
import { getAllAppointmentsQueryFn } from "@/features/appointment/api";

// Lấy tất cả cuộc hẹn (cho admin)
export const useGetAllAppointments = (
  params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    employeeId?: string;
    customerId?: string;
    petId?: string;
  }
) => {
  return useQuery({
    queryKey: ["adminAppointments", params],
    queryFn: () => getAllAppointmentsQueryFn(params), 
  });
};