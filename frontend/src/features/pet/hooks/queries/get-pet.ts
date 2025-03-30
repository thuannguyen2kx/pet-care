import { useQuery } from "@tanstack/react-query";
import { getPetQueryFn } from "@/features/pet/api";

/**
 * Hook để lấy thông tin chi tiết của thú cưng
 */
export const usePetDetails = (petId: string ) => {
  return useQuery({
    queryKey: ["pets", petId],
    queryFn: () => getPetQueryFn(petId),
    enabled: !!petId,
  });
};