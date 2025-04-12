import { useQuery } from "@tanstack/react-query"
import { getAppointmentByIdQueryFn } from "@/features/appointment/api"

export const useGetAppointmentById = (appointmentId: string) => {
  return useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => getAppointmentByIdQueryFn(appointmentId),
    enabled: !!appointmentId
  })
}