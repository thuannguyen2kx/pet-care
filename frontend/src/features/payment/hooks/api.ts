import API from "@/lib/axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook for creating a Stripe checkout session
 */
export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const { data } = await API.post(
        `/payments/create-checkout-session/${appointmentId}`
      );
      return data;
    },
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

/**
 * Hook for processing non-Stripe payments (cash, bank transfer)
 */
export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      paymentMethod,
    }: {
      appointmentId: string;
      paymentMethod: string;
    }) => {
      const { data } = await API.post(`/payments/process/${appointmentId}`, {
        paymentMethod,
      });
      return data;
    },
    onSuccess: (data) => {
      // If response indicates we should redirect to Stripe
      if (data.redirectToStripe) {
        // We don't actually redirect here, the component will handle that
        return data;
      }

      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Thanh toán được xử lý thành công");

      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

/**
 * Hook to check payment status (used after returning from Stripe)
 */
export const useCheckPaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data } = await API.get(
        `/payments/success?session_id=${sessionId}`
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });

      if (data.success) {
        toast.success("Thanh toán thành công!");
      }

      return data;
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};
