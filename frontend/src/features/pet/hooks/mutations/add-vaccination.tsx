import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { addVaccinationMutationFn } from "@/features/pet/api";

/**
 * Hook để thêm thông tin tiêm phòng
 */
export const useAddVaccination = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addVaccinationMutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pets", data.pet._id] });
      toast("Thêm thành công", {
        description: "Thông tin tiêm phòng đã được thêm.",
      });
    },
    onError: (error) => {
      toast("Lỗi khi thêm tiêm phòng", {
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại.",
      });
    },
  });
};