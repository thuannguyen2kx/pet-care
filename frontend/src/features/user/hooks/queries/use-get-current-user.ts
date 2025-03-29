import { useQuery } from "@tanstack/react-query"
import { getCurrentUserQueryFn } from "../../api"

export const useGetCurrentUser = () => {
  const query = useQuery({
    queryKey: ["current"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 0,
    retry: 2
  })
  return query
}