import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { commentQueryKeys } from '@/features/comment/api/query-keys';
import type { AddComment } from '@/features/comment/domain/comment-state';
import type { AddCommentDto } from '@/features/comment/domain/comment.dto';
import { mapAddCommentToDto } from '@/features/comment/domain/comment.transform';
import { POST_ENDPOINTS } from '@/shared/config/api-endpoints';
import { http } from '@/shared/lib/http';

export function addComment({
  postId,
  addCommentDto,
}: {
  postId: string;
  addCommentDto: AddCommentDto;
}) {
  return http.post(POST_ENDPOINTS.COMMENTS(postId), addCommentDto);
}

type UseAddCommentOptions = {
  mutationConfig?: UseMutationOptions<unknown, unknown, AddComment, unknown>;
};

export const useAddComment = ({ mutationConfig }: UseAddCommentOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    onSuccess(data, variables, onMutateResult, context) {
      queryClient.invalidateQueries({
        queryKey: commentQueryKeys.post(variables.postId),
      });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restConfig,
    mutationFn: (addCommentData: AddComment) => {
      const addCommentDto = mapAddCommentToDto(addCommentData);
      return addComment({
        postId: addCommentData.postId,
        addCommentDto,
      });
    },
  });
};
