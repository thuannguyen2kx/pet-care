import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Trash2,
  Edit,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { PostType } from "../types/api.types";
import { useAuthContext } from "@/context/auth-provider";
import { Roles } from "@/constants";
import { useDeletePost } from "../hooks/mutations/use-delete-post";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import ReportPostDialog from "./report-dialog";
import { ReactionButton } from "@/features/reaction/components/reaction-button";
import { ReactionsDialog } from "@/features/reaction/components/reaction-dialog";

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
    "Bạn có chắc chắn muốn xoá bài viết này? Hành động này không thể hoàn tác."
  );
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { mutate: deletePost } = useDeletePost();

  const isAuthor = user && post.authorId._id === user._id;
  const isAdmin = user && user?.role === Roles.ADMIN;
  const canModify = isAuthor || isAdmin;

  // Handle post deletion
  const handleDelete = async () => {
    const confirmed = await confirmDelete();
    if (!confirmed) return;

    deletePost(post._id, {
      onSuccess: () => {
        toast.success("Bài viết đã được xóa thành công");
      },
      onError: () => {
        toast.error("Không thể xóa bài viết. Vui lòng thử lại sau.");
      },
    });
  };

  // Handle share post
  const handleShare = () => {
    const postUrl = `${window.location.origin}/posts/${post._id}`;
    navigator.clipboard
      .writeText(postUrl)
      .then(() => toast.success("Đã sao chép liên kết bài viết"))
      .catch(() => toast.error("Không thể sao chép liên kết"));
  };

  // Format the post date
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <>
      <DeleteDialog />
      {showReportDialog && (
        <ReportPostDialog
          postId={post._id}
          open={showReportDialog}
          onOpenChange={setShowReportDialog}
        />
      )}

      <div className="bg-white border border-gray-100 rounded-md overflow-hidden mb-6">
        {/* Header with avatar and username */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            to={`/profile/${post.authorId._id}`}
            className="flex items-center gap-3"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={post.authorId.profilePicture?.url}
                alt={post.authorId.fullName}
              />
              <AvatarFallback className="bg-primary text-white text-xs">
                {post.authorId.fullName?.slice(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{post.authorId.fullName}</p>
              <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
          </Link>

          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canModify && (
                  <>
                    {onEdit && (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onEdit(post)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                      className="text-red-500 cursor-pointer"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xoá
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Sao chép liên kết
                </DropdownMenuItem>
                {!canModify && (
                  <DropdownMenuItem
                    className="cursor-pointer text-orange-600"
                    onClick={() => setShowReportDialog(true)}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Báo cáo bài viết
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Title (if available) */}
        {post.title && (
          <div className="px-4 py-1">
            <h3 className="font-medium text-base">{post.title}</h3>
          </div>
        )}

        {/* Media content */}
        {post.media && post.media.length > 0 && (
          <div className="aspect-square bg-gray-50 relative">
            {post.media.length === 1 ? (
              // Single media
              <>
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
              </>
            ) : (
              // Multiple media
              <Carousel className="w-full">
                <CarouselContent>
                  {post.media.map((media, index) => (
                    <CarouselItem key={index}>
                      {media.type === "image" ? (
                        <img
                          src={media.url}
                          alt={`Post image ${index + 1}`}
                          className="w-full h-full object-cover aspect-square"
                        />
                      ) : (
                        <video
                          src={media.url}
                          controls
                          className="w-full h-full object-cover aspect-square"
                        />
                      )}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between px-4 pt-3 pb-1">
          <div className="flex space-x-4">
            {/* Advanced reaction button */}
            <ReactionButton
              contentType="post"
              contentId={post._id}
              currentUser={user}
            />

            <Link to={`/posts/${post._id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <MessageSquare size={22} />
                <span>Bình luận</span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
              onClick={handleShare}
            >
              <Share2 size={22} />
              <span>Chia sẻ</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Bookmark size={22} />
          </Button>
        </div>

        {/* Reactions dialog */}
        <div className="px-4 pt-1">
          <ReactionsDialog contentType="post" contentId={post._id} />
        </div>

        {/* Caption */}
        <div className="px-4 py-2">
          <div className="text-sm">
            <Link
              to={`/profile/${post.authorId._id}`}
              className="font-semibold mr-1.5 hover:underline"
            >
              {post.authorId.fullName}
            </Link>
            {post.content.length > 150 ? (
              <>
                {post.content.substring(0, 150)}...
                <Link
                  to={`/posts/${post._id}`}
                  className="text-gray-500 ml-1 hover:underline"
                >
                  xem thêm
                </Link>
              </>
            ) : (
              post.content
            )}
          </div>

          {/* Hashtags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.map((tag, index) => (
                <Link
                  key={index}
                  to={`/tags/${tag}`}
                  className="text-sm text-blue-500 hover:underline"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* View comments link */}
        {post.stats.commentCount > 0 && (
          <div className="px-4 py-1">
            <Link
              to={`/posts/${post._id}`}
              className="text-gray-500 text-sm hover:underline"
            >
              Xem tất cả {post.stats.commentCount} bình luận
            </Link>
          </div>
        )}

        {/* Add comment section */}
        <div className="flex items-center px-4 py-3 border-t mt-2">
          <input
            type="text"
            placeholder="Thêm bình luận..."
            className="flex-1 text-sm border-none bg-transparent outline-none"
          />
          <Link to={`/posts/${post._id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary font-medium text-sm"
            >
              Đăng
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};
