import { useQuery } from "@tanstack/react-query";
import { getUserAppointmentsQueryFn } from "@/features/appointment/api";

// Lấy cuộc hẹn của người dùng hiện tại
export const useGetUserAppointments = () => {
  return useQuery({
    queryKey: ["userAppointments"],
    queryFn: getUserAppointmentsQueryFn,
  });
};