import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createPetWithPictureMutationFn } from "@/features/pet/api";

/**
 * Hook để tạo thú cưng mới kèm ảnh đại diện
 */
export const useCreatePetWithPicture = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPetWithPictureMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast("Tạo thành công", {
        description: "Thú cưng mới đã được tạo cùng ảnh đại diện.",
      });
    },
    onError: (error) => {
      toast("Lỗi khi tạo thú cưng", {
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại.",
      });
    },
  });
};