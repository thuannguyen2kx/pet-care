import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginMutationFn } from "../../api";
import { toast } from "sonner";
import { useStore } from "@/store/store";

export const useLogin = () => {
  const { setAccessToken } = useStore();
  const queriesClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: loginMutationFn,
    onSuccess: (data) => {
      const accessToken = data.access_token;

      setAccessToken(accessToken);
      toast.success("Đăng nhập thành công");
      queriesClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Đăng nhập thất bại");
    },
  });

  return mutation;
};
