import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { assignAppointment } from "@/features/employee/api";
import { employeeKeys } from "@/features/employee/query-key";

// Assign appointment mutation
export const useAssignAppointment = (employeeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (appointmentId: string) => 
      assignAppointment(employeeId, appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: employeeKeys.schedule(employeeId, {}) 
      });
      toast.success("Đã phân công nhân viên");
    },
    onError: (error) => {
      toast.error(
        error?.message
      );
    },
  });
};