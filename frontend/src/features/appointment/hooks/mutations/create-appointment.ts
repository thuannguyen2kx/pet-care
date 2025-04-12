import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createAppointmentMutationFn } from "@/features/appointment/api";

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointmentMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["timeSlots"] });
      toast.success("Đặt lịch hẹn thành công!");
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};