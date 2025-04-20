import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-md overflow-hidden mb-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div>
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-16 mt-1.5" />
          </div>
        </div>
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>

      {/* Media skeleton */}
      <Skeleton className="w-full aspect-square" />

      {/* Action buttons skeleton */}
      <div className="flex justify-between px-4 pt-3 pb-1">
        <div className="flex space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Likes skeleton */}
      <div className="px-4 pt-1">
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Caption skeleton */}
      <div className="px-4 py-2">
        <Skeleton className="h-4 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Comments link skeleton */}
      <div className="px-4 py-1">
        <Skeleton className="h-3.5 w-28" />
      </div>

      {/* Add comment section skeleton */}
      <div className="flex items-center px-4 py-3 border-t mt-2">
        <Skeleton className="flex-1 h-8" />
        <Skeleton className="h-8 w-16 ml-2" />
      </div>
    </div>
  );
};

export default PostCardSkeleton;