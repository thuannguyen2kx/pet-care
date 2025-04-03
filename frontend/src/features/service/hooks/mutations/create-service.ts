import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createServiceMutationFn } from "@/features/service/api"

export const useCreateService = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
      mutationFn: (serviceData: FormData) => createServiceMutationFn(serviceData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['services'] });
      }
  })

  return mutation
}