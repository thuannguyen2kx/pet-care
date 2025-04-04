import { useMutation } from "@tanstack/react-query";
import { resetPasswordMutationFn } from "@/features/employee/api";
import { toast } from "sonner";

// Reset password mutation
export const useResetPassword = (id: string) => {
  return useMutation({
    mutationFn: (newPassword: string) => 
      resetPasswordMutationFn(id, newPassword),
    onSuccess: () => {
      toast.success("Mật khẩu đã cập nhật");
    },
    onError: (error) => {
      toast.error(
        error?.message || "Có lỗi khi cập nhật mật khẩu"
      );
    },
  });
};