import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateAppointmentMutationFn } from "@/features/appointment/api";

// Cập nhật trạng thái cuộc hẹn
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAppointmentMutationFn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userAppointments"] });
      queryClient.invalidateQueries({
        queryKey: ["appointment", variables.appointmentId],
      });
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
      toast.success("Cập nhật trạng thái cuộc hẹn thành công");
    },
    onError: (error) => {
      toast.error(error?.message || "Có lỗi xảy ra khi cập nhật trạng thái");
    },
  });
};