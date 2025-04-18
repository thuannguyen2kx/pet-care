import API from "@/lib/axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GetAdminPaymentsType, GetPaymentSummaryData, PaymentDetailType, PaymentType, RefundPaymentParams } from "../types/api.types";

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
export const refundPaymentMutationFn = async ({
  paymentId,
  amount,
  reason,
}: RefundPaymentParams) => {
  const { data } = await API.post(`/payments/${paymentId}/refund`, {
    amount,
    reason,
  });
  return data;
};
export const maskPaymentAsPaidMutationFn = async (paymentId: string) => {
  const { data } = await API.put(`/payments/${paymentId}/mark-as-paid`);
  return data;
};

export const processPaymentMutationFn = async ({ appointmentId, paymentMethod }: { appointmentId: string, paymentMethod: string }) => {
  const { data } = await API.post(`/payments/process/${appointmentId}`, {
    paymentMethod,
  });
  return data;
}

export const createCheckoutSessionMutationFn = async (
  appointmentId: string
) => {
  const { data } = await API.post(
    `/payments/create-checkout-session/${appointmentId}`
  );
  return data;
};

export const getPaymentByIdQueryFn = async (paymentId: string): Promise<{payment: PaymentDetailType}> => {
  const { data } = await API.get(`/payments/${paymentId}`);
  return data;
};

export const getUserPaymentsQueryFn = async (): Promise<{payments: PaymentDetailType[]}> => {
  const { data } = await API.get(`/payments`);
  return data;
};

export const getAdminPaymentsQueryFn = async (queryString: string): Promise<GetAdminPaymentsType> => {
  const { data } = await API.get(`payments/admin/all${queryString}`);
  return data;
};
export const getPaymentSummaryQueryFn = async (): Promise<GetPaymentSummaryData> => {
  const {data} = await API.get(`/payments/admin/summary`);
  return data;
}
export const getPaymentByAppointmentQueryFn = async (appointmentId: string): Promise<{payment: PaymentType}> => {
  const { data } = await API.get(`/payments/by-appointment/${appointmentId}`);
  return data;
}