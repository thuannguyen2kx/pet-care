import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logoutMutationFn } from "../../api"
import { toast } from "sonner"
import { useStore } from "@/store/store"

export const useLogout  =() => {
  const queryClient = useQueryClient()
  const {clearAccessToken} = useStore()
  
  const mutation = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["current"] });
      clearAccessToken()
    },
    onError: (error) => {
      toast.error("Đăng xuất thất bại", {
        description: error.message
      })
    }
  })
  return mutation
}