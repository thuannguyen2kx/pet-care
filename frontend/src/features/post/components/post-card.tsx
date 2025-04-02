import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageSquare,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PostType } from "../types/api.types";
import { useAuthContext } from "@/context/auth-provider";
import { Roles } from "@/constants";
import { useDeletePost } from "../hooks/mutations/use-delete-post";
import { useConfirm } from "@/hooks/use-confirm";

interface PostCardProps {
  post: PostType;
  showActions?: boolean;
  onEdit?: (post: PostType) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  showActions = true,
  onEdit,
}) => {
  const { user } = useAuthContext();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Xoá bài viết",
    "Bạn có chắc chắn muốn xoá bài viết này"
  );

  const { mutate } = useDeletePost();

  const isAuthor = user && post.authorId._id === user._id;
  const isAdmin = user && user?.role === Roles.ADMIN;
  const canModify = isAuthor || isAdmin;

  // Format the post date
  const formattedDate = format(new Date(post.createdAt), "d MMMM");
  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    mutate(post._id);
  };
  return (
    <>
      <DeleteDialog />
      <div className="border-b border-gray-100 pb-2 mb-4 md:border md:rounded-md md:mb-6 md:pb-0">
        {/* Header with avatar and username */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2.5">
            <Link to={`/profile/${post.authorId._id}`}>
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={post.authorId.profilePicture?.url}
                  alt={post.authorId.fullName}
                />
                <AvatarFallback>
                  {post.authorId.fullName?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <Link
              to={`/profile/${post.authorId._id}`}
              className="font-semibold text-sm"
            >
              {post.authorId.fullName}
            </Link>
          </div>

          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-none">
                {canModify && (
                  <>
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(post)}>
                        Chỉnh sửa
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={handleDelete}
                    >
                      Xoá
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem
                  onClick={() =>
                    window.navigator.clipboard.writeText(
                      `${window.location.origin}/posts/${post._id}`
                    )
                  }
                >
                  Sao chép liên kết
                </DropdownMenuItem>
                <DropdownMenuItem>Báo cáo</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Media content */}
        {post.media && post.media.length > 0 && (
          <div className="aspect-square bg-gray-50">
            {post.media[0].type === "image" ? (
              <img
                src={post.media[0].url}
                alt="Post image"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={post.media[0].url}
                controls
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between px-4 pt-2.5 pb-1">
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
              <Heart size={24} />
            </Button>
            <Link to={`/posts/${post._id}`}>
              <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                <MessageSquare size={24} />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
              <Send size={24} />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
            <Bookmark size={24} />
          </Button>
        </div>

        {/* Likes */}
        {post.stats.likeCount > 0 && (
          <div className="px-4 pt-1 font-semibold text-sm">
            {post.stats.likeCount}{" "}
            {post.stats.likeCount === 1 ? "like" : "likes"}
          </div>
        )}

        {/* Caption */}
        <div className="px-4 py-1">
          <div className="text-sm">
            <Link
              to={`/profile/${post.authorId._id}`}
              className="font-semibold mr-1.5"
            >
              {post.authorId.fullName}
            </Link>
            {post.content.length > 100 ? (
              <>
                {post.content.substring(0, 100)}...
                <Link to={`/posts/${post._id}`} className="text-gray-500 ml-1">
                  more
                </Link>
              </>
            ) : (
              post.content
            )}
          </div>

          {/* Hashtags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {post.tags.map((tag, index) => (
                <span key={index} className="text-sm text-blue-500">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* View comments link */}
        {post.stats.commentCount > 0 && (
          <div className="px-4 py-0.5">
            <Link to={`/posts/${post._id}`} className="text-gray-500 text-sm">
              View all {post.stats.commentCount} comments
            </Link>
          </div>
        )}

        {/* Date */}
        <div className="px-4 py-0.5 text-xs text-gray-500 uppercase">
          {formattedDate}
        </div>

        {/* Add comment section */}
        <div className="flex items-center px-4 py-3 border-t mt-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 text-sm border-none bg-transparent outline-none"
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-500 font-semibold text-sm"
          >
            Post
          </Button>
        </div>
      </div>
    </>
  );
};
