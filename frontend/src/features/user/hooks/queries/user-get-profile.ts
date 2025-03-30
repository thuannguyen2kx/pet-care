import { useQuery } from "@tanstack/react-query";
import { getProfileByIdQueryFn } from "../../api";

export const useGetProfile = (profileId: string) => {
  const query = useQuery({
    queryKey: ["profile", profileId],
    queryFn: () => getProfileByIdQueryFn(profileId),
    enabled: !!profileId,
  });
  return query;
};
