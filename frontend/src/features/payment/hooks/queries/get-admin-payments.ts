/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import { getAdminPaymentsQueryFn } from "../api";

/**
 * Fetches all payments for admin
 */
export const useGetAdminPayments = (params?: Record<string, any>) => {
  // Construct query string from params
  const queryString = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params)
          .filter(
            ([, value]) =>
              value !== undefined && value !== null && value !== ""
          )
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
      ).toString()
    : "";

  return useQuery({
    queryKey: ["payments", "admin", params],
    queryFn: () => getAdminPaymentsQueryFn(queryString),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
