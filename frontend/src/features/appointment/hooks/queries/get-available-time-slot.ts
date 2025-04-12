import { useQuery } from "@tanstack/react-query";
import { getAvailableTimeSlotsQueryFn } from "@/features/appointment/api";

// Lấy khung giờ có sẵn cho một ngày cụ thể
export const useGetAvailableTimeSlots = (
  date?: Date,
  serviceId?: string,
  serviceType?: string
) => {
  return useQuery({
    queryKey: ["timeSlots", date, serviceId, serviceType],
    queryFn: () =>
      getAvailableTimeSlotsQueryFn({ date, serviceId, serviceType }),
    enabled: !!date,
  });
};