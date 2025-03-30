import { useQuery } from "@tanstack/react-query";
import { getPetsQueryFn } from "@/features/pet/api";

export const useUserPets = () => {
  return useQuery({
    queryKey: ["pets"],
    queryFn: getPetsQueryFn,
  });
};