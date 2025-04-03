import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ServiceType } from "@/features/service/types/api.types";
import { updateServiceMutationFn } from "@/features/service/api";

export const useUpdateService = (id: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (serviceData: Partial<ServiceType>) => updateServiceMutationFn(id, serviceData ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['service', id] });
    }
  })

  return mutation
}