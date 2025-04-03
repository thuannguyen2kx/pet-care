import { useQuery, UseQueryOptions} from "@tanstack/react-query";
import { getServicesQueryFn } from "@/features/service/api";
import { GetServicesResponseType } from "@/features/service/types/api.types";

export const useGetServices = (
  filter?: {
    category?: string;
    petType?: string;
    isActive?: boolean;
  },
  options?: UseQueryOptions<GetServicesResponseType>
) => {
  const query = useQuery({
    queryKey: ["services", filter],
    queryFn: () => getServicesQueryFn(filter),
    ...options
  });

  return query;
};