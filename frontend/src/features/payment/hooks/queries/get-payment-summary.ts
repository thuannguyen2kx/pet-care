import { useQuery } from "@tanstack/react-query";
import { getPaymentSummaryQueryFn } from "../api";

/**
 * Fetches payment summary statistics (admin only)
 */
export const useGetPaymentsSummary = () => {
  return useQuery({
    queryKey: ['payments', 'summary'],
    queryFn: getPaymentSummaryQueryFn,
    staleTime: 1000 * 60 * 15 
  });
};