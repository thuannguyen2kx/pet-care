import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { registerMutationFn } from "@/features/auth/api"

export const useRegister = () => {
  const mutation = useMutation({
    mutationFn: registerMutationFn,
    onSuccess: () => {
      toast.success("Đăng ký thành công")
    },
    onError: (error) => {
      toast.error("Đăng ký thất bại", {
        description: error.message
      })
    }
  })
  return mutation
}