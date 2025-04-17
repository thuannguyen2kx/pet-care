import { useQuery } from "@tanstack/react-query";
import { getPaymentByIdQueryFn } from "../api";

/**
 * Fetches payment details by payment ID
 */
export const useGetPaymentById = (paymentId: string) => {
  return useQuery({
    queryKey: ["payment", paymentId],
    queryFn: () => getPaymentByIdQueryFn(paymentId),
    enabled: !!paymentId,
    staleTime: 1000 * 60 * 5 
  });
};
