
import InfinitePostList from "./infinite-post-list";
import { PostQueryParams } from "../types/api.types";

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
    <div className="container max-w-3xl mx-auto px-0 sm:px-4 py-4">
      <InfinitePostList
        queryParams={getQueryParams()}
      />
    </div>
  );
};
