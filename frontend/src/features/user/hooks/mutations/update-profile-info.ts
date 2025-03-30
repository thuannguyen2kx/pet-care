import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProfileInfoMutationFn } from "@/features/user/api";

export const useUpdateProfileInfo = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateProfileInfoMutationFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile", data.user._id] });
      toast("Cập nhật thông tin thành công", {
        description: "Thông tin cá nhân của bạn đã được cập nhật.",
      });
    },
    onError: (error) => {
      toast("Lỗi cập nhật", {
        description: error.message,
      });
    },
  });
  return mutation;
};
