import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateAvailabilityMutationFn } from "@/features/employee/api";
import { employeeKeys } from "@/features/employee/query-key";

// Update employee availability mutation
export const useUpdateAvailability = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      workDays?: string[];
      workHoursStart?: string;
      workHoursEnd?: string;
      vacationStart?: string;
      vacationEnd?: string;
    }) => updateAvailabilityMutationFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: employeeKeys.schedule(id, {}) 
      });
      toast.success("Availability updated successfully");
    },
    onError: (error) => {
      toast.error(
        error?.message
      );
    },
  });
};