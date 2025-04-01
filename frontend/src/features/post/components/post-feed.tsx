import { useMutation, useQueryClient } from "@tanstack/react-query";

import InfinitePostList from "./infinite-post-list";
import { PostQueryParams } from "../types/api.types";
import { deletePostFn } from "../api";
import { postKeys } from "../query-key";
import { toast } from "sonner";

export const PostFeed = () => {
  const queryClient = useQueryClient();

  const getQueryParams = (): PostQueryParams => {
    const params: PostQueryParams = {
      sortBy: "createdAt",
      sortDirection: "desc",
      limit: 7,
    };
    return params;
  };

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: deletePostFn,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      toast("Bài viết đã được xoá");
    },
    onError: () => {
      toast("Có lỗi khi xoá bài viết");
    },
  });

  return (
    <div className="container max-w-3xl mx-auto px-0 sm:px-4 py-4">
      <InfinitePostList
        queryParams={getQueryParams()}
        onDeletePost={deleteMutation.mutateAsync}
      />
    </div>
  );
};
