import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeUserStatusMutationFn } from "@/features/user/api";

export const useChangeUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeUserStatusMutationFn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "user", variables.userId],
      });
    },
  });
};
