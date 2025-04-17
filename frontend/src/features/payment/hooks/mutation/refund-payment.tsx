import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refundPaymentMutationFn } from "../api";
import { toast } from "sonner";

export const useRefundPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refundPaymentMutationFn, 
    onSuccess: (data) => {
      toast.success('Đã xử lý hoàn tiền thành công');
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['payment', data.payment._id] });
      queryClient.invalidateQueries({ queryKey: ['payment', 'appointment', data.payment.appointmentId] });
      queryClient.invalidateQueries({ queryKey: ['appointment', data.payment.appointmentId] });
    },
    onError: (error: Error) => {
      toast.error(`Không thể xử lý hoàn tiền: ${error.message}`);
    },
  });
};