import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { maskPaymentAsPaidMutationFn } from "../api";

export const useMarkPaymentAsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: maskPaymentAsPaidMutationFn,
    onSuccess: (data) => {
      toast.success('Đã đánh dấu thanh toán thành công');
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['payment', data.payment._id] });
      queryClient.invalidateQueries({ queryKey: ['payment', 'appointment', data.payment.appointmentId] });
      queryClient.invalidateQueries({ queryKey: ['appointment', data.payment.appointmentId] });
    },
    onError: (error: Error) => {
      toast.error(`Không thể đánh dấu thanh toán: ${error.message}`);
    },
  });
};
