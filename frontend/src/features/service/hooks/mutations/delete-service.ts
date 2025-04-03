import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteServiceMutationFn } from "@/features/service/api";

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteServiceMutationFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    }
  })
  return mutation
}