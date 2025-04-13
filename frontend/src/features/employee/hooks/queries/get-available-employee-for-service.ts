import { QueryOptions, useQuery } from "@tanstack/react-query";
import { getAvailableEmployeeForServiceQueryFn } from "@/features/employee/api";
import { EmployeeType } from "../../types/api.types";

/**
 * Hook để lấy danh sách nhân viên có thể thực hiện dịch vụ trong khung giờ đã chọn
 *
 * @param serviceId - ID của dịch vụ
 * @param serviceType - Loại dịch vụ (SINGLE hoặc PACKAGE)
 * @param timeSlot - Khung giờ đã chọn theo định dạng "HH:MM-HH:MM"
 * @returns Danh sách nhân viên phù hợp
 */
export const useGetAvailableEmployeesForService = (
  {
    serviceId,
    serviceType,
    date,
    timeSlot,
  }: {
    serviceId: string;
    serviceType: string;
    date?: string;
    timeSlot?: string;
  },
  options?: QueryOptions<{ message: string; employees: EmployeeType[] }>
) => {
  return useQuery({
    queryKey: ["employees", serviceId, serviceType, date, timeSlot],
    queryFn: () =>
      getAvailableEmployeeForServiceQueryFn({
        serviceId,
        serviceType,
        date,
        timeSlot,
      }),
    enabled: !!serviceId && !!serviceType, // Chỉ gọi API khi có serviceId và serviceType
    refetchOnWindowFocus: false, // Không refetch khi focus lại cửa sổ`

    ...options,
    staleTime: 5 * 60 * 1000, // Cache trong 5 phút
  });
};
