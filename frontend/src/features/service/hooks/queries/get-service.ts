import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getServiceByIdQueryFn } from "@/features/service/api";
import { GetServiceResonseType } from "../../types/api.types";

export const useGetService = (id: string, options?: UseQueryOptions<GetServiceResonseType>) => {
  const query = useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceByIdQueryFn(id),
    enabled: !!id,
    ...options,
  });

  return query;
};