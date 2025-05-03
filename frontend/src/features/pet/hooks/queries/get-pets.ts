import { useQuery } from "@tanstack/react-query";
import { getPetsQueryFn } from "@/features/pet/api";

export const useUserPets = (userId: string) => {
  return useQuery({
    queryKey: ["pets"],
    queryFn:() => getPetsQueryFn(userId),
  });
};