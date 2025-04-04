import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { employeeKeys } from "@/features/employee/query-key";
import { uploadProfilePictureMutationFn } from "@/features/employee/api";

// Upload profile picture mutation
export const useUploadProfilePicture = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => uploadProfilePictureMutationFn(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) });
      toast.success("Đã cập nhật ảnh");
    },
    onError: (error) => {
      toast.error(
        error?.message || "Có lỗi khi cập nhật ảnh"
      );
    },
  });
};