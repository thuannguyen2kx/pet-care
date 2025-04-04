import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { CreateEmployeeDTO } from "@/features/employee/types/api.types";
import { createEmployeeMutationFn } from "@/features/employee/api";
import { employeeKeys } from "@/features/employee/query-key";

// Create employee mutation
export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateEmployeeDTO) => createEmployeeMutationFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      toast.success("Tạo nhân viên thành công");
    },
    onError: (error) => {
      toast.error(error?.message || "Có lỗi xảy ra khi tạo nhân viên");
    },
  });
};