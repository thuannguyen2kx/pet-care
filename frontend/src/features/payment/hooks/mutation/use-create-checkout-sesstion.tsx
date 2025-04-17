import { useMutation } from "@tanstack/react-query";
import { createCheckoutSessionMutationFn } from "../api";
import { toast } from "sonner";

/**
 * Hook for creating a Stripe checkout session
 */
export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: createCheckoutSessionMutationFn,
    onSuccess: (data) => {
      if (data.url) {
        // Redirect to Stripe checkout URL
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast.error(`Không thể tạo phiên thanh toán: ${error.message}`);
    },
  });
};
