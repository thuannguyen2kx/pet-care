import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPetMutationFn } from "@/features/pet/api";

/**
 * Hook để tạo thú cưng mới (không kèm ảnh)
 */
export const useCreatePet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPetMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast("Tạo thành công", {
        description: "Thú cưng mới đã được tạo.",
      });
    },
    onError: (error) => {
      toast("Lỗi khi tạo thú cưng", {
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại.",
      });
    },
  });
};