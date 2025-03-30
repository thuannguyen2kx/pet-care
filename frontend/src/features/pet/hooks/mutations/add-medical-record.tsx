import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { addMedicalRecordMutationFn } from "@/features/pet/api";

/**
 * Hook để thêm lịch sử y tế
 */
export const useAddMedicalRecord = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addMedicalRecordMutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pets", data.pet._id] });
      toast("Thêm thành công", {
        description: "Lịch sử y tế đã được thêm.",
      });
    },
    onError: (error) => {
      toast("Lỗi khi thêm lịch sử y tế", {
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại.",
      });
    },
  });
};