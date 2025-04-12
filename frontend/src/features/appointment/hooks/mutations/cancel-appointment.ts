import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { canncelAppointmentMutationFn } from "@/features/appointment/api";

// Hủy cuộc hẹn
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: canncelAppointmentMutationFn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment", variables] });
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["timeSlots"] });
      toast.success("Hủy cuộc hẹn thành công");
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};