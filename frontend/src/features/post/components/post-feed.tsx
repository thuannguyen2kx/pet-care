import { PostQueryParams } from "@/features/post/types/api.types";
import InfinitePostList from "./infinite-post-list";

export const PostFeed = () => {
  const getQueryParams = (): PostQueryParams => {
    const params: PostQueryParams = {
      sortBy: "createdAt",
      sortDirection: "desc",
      limit: 7,
    };
    return params;
  };

  return (
    <div className="max-w-2xl mx-auto px-0 sm:px-4">
      <InfinitePostList queryParams={getQueryParams()} />
    </div>
  );
};
