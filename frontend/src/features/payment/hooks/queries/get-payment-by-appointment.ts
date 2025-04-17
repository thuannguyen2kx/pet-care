import { useQuery } from "@tanstack/react-query";
import { getPaymentByAppointmentQueryFn } from "../api";

export const useGetPaymentByAppointment = (appointmentId: string) => {
  return useQuery({
    queryKey: ["payment", "appointment", appointmentId],
    queryFn: () => getPaymentByAppointmentQueryFn(appointmentId),
    enabled: !!appointmentId,
  });
};
