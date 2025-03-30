import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deletePetMutationFn } from "@/features/pet/api";

/**
 * Hook để xóa thú cưng
 */
export const useDeletePet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deletePetMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast("Xóa thành công", {
        description: "Thú cưng đã được xóa.",
      });
    },
    onError: (error) => {
      toast("Lỗi khi xóa", {
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại.",
      });
    },
  });
};