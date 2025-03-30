import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updatePetPictureMutationFn } from "@/features/pet/api";

/**
 * Hook để cập nhật ảnh đại diện của thú cưng
 */
export const useUpdatePetPicture = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updatePetPictureMutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["pets", data.pet._id] });
      toast("Cập nhật thành công", {
        description: "Ảnh đại diện của thú cưng đã được cập nhật.",
      });
    },
    onError: (error) => {
      toast("Lỗi khi cập nhật ảnh", {
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại.",
      });
    },
  });
};