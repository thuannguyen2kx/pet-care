import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { processPaymentMutationFn } from "../api";

/**
 * Hook for processing a payment
 */
export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processPaymentMutationFn,
    onSuccess: (data, variables) => {
      // Check if we need to redirect to Stripe
      if (data.redirectToStripe) {
        // Use the checkout session hook instead
        return;
      }

      toast.success('Đã xác nhận phương thức thanh toán thành công');
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['payment', 'appointment', variables.appointmentId] });
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.appointmentId] });
    },
    onError: (error: Error) => {
      toast.error(`Không thể xử lý thanh toán: ${error.message}`);
    },
  });
};