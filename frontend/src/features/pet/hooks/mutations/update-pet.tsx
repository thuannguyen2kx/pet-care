import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updatePetMutationFn } from "@/features/pet/api";

/**
 * Hook để cập nhật thông tin thú cưng
 */
export const useUpdatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePetMutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["pets", data.pet._id] });
      toast("Cập nhật thành công", {
        description: "Thông tin thú cưng đã được cập nhật.",
      });
    },
    onError: (error) => {
      toast("Lỗi khi cập nhật", {
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại.",
      });
    },
  });
};
