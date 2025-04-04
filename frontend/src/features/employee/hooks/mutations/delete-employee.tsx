import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteEmployeeMutationFn } from "@/features/employee/api";
import { employeeKeys } from "@/features/employee/query-key";
// Delete employee mutation
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteEmployeeMutationFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      toast.success("Đã xoá nhân viên");
    },
    onError: (error) => {
      toast.error(
        error?.message || "Có lỗi xảy ra khi xoá thông tin nhân viên"
      );
    },
  });
};