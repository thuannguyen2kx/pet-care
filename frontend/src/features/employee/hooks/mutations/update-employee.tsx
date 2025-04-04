import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { UpdateEmployeeDTO } from "@/features/employee/types/api.types";
import { updateEmployeeMutationFn } from "@/features/employee/api";
import { employeeKeys } from "@/features/employee/query-key";

// Update employee mutation
export const useUpdateEmployee = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEmployeeDTO) => updateEmployeeMutationFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      toast.success("Đã cập nhật thông tin nhân viên");
    },
    onError: (error) => {
      toast.error(error?.message || "Cập nhật thông tin nhân viên thất bại");
    },
  });
};
