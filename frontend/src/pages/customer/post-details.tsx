import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  MessageSquare,
  Eye,
  Calendar,
  Share2,
  MoreHorizontal,
  Pencil,
  Trash,
  Flag,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { useGetPostDetail } from "@/features/post/hooks/queries/get-post";
import { useDeletePost } from "@/features/post/hooks/mutations/use-delete-post";
import { useReportPost } from "@/features/post/hooks/mutations/report-post";
import { ReasonType } from "@/features/post/types/api.types";
import { useAuthContext } from "@/context/auth-provider";
import { Roles } from "@/constants";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { CommentList } from "@/features/comment/components/comment-list";
import { ReactionButton } from "@/features/reaction/components/reaction-button";

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState<string | null>(null);
  const [reportDetails, setReportDetails] = useState("");

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Xoá bài viết",
    "Bạn có chắc chắn muốn xoá bài viết này"
  );
  const { data, isLoading, isError, error, refetch } = useGetPostDetail(
    postId!
  );

  const deleteMutation = useDeletePost();
  const reportMutation = useReportPost();

  const isAuthor = user && data?.post?.authorId._id === user._id;
  const isAdmin = user && user.role === Roles.ADMIN;
  const canModify = isAuthor || isAdmin;

  const handleReport = async () => {
    if (!reportReason) {
      toast("Vui lòng chọn lý do báo cáo");
      return;
    }

    try {
      await reportMutation.mutateAsync({
        id: postId!,
        reportData: {
          reason: reportReason as ReasonType,
          details: reportDetails,
        },
      });

      toast(
        "Cảm ơn bạn đánh báo cáo bài viết. Chúng tôi sẽ xem xét và giải quyết."
      );
      setIsReportDialogOpen(false);
      refetch();
    } catch {
      toast("Có lỗi khi báo cáo");
    }
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteMutation.mutate(postId!);
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Đã sao chép đường dẫn bài viết");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Đang tải bài viết...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-none">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">
                Có lỗi xảy ra khi tải bài viết
              </h2>
              <p className="text-red-500 mb-4">
                {error instanceof Error
                  ? error.message
                  : "Không thể lấy thông tin bài viết"}
              </p>
              <Button onClick={() => navigate("/")}>Quay lại trang chủ</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { post } = data;
  const formattedDate = format(new Date(post.createdAt), "MMMM d, yyyy");

  return (
    <>
      <DeleteDialog />
      <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <Card className="border-none shadow-none p-0">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={post.authorId.profilePicture?.url}
                    alt={post.authorId.fullName}
                  />
                  <AvatarFallback>
                    {post.authorId.fullName?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <Link
                    to={`/profile/${post.authorId._id}`}
                    className="font-semibold text-lg hover:underline"
                  >
                    {post.authorId.fullName}
                  </Link>
                  <CardDescription className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{formattedDate}</span>
                  </CardDescription>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-none">
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Post
                  </DropdownMenuItem>

                  {canModify && (
                    <>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Chỉnh sửa bài viết
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-red-500"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Xoá bài viết
                      </DropdownMenuItem>
                    </>
                  )}

                  {!isAuthor && user && (
                    <DropdownMenuItem
                      onClick={() => setIsReportDialogOpen(true)}
                      className="text-red-500"
                    >
                      <Flag className="mr-2 h-4 w-4" />
                      Báo cáo bài viết
                    </DropdownMenuItem>
                  )}

                  {isAdmin && (
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(`/admin/posts/${post._id}/moderate`)
                      }
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Kiểm duyệt bài viết
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            {post.title && (
              <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
            )}

            {/* Post content with proper formatting */}
            <div className="prose max-w-none">
              {post.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

             {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Media gallery */}
            {post.media && post.media.length > 0 && (
              <div className="space-y-4">
                {post.media.map((item, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-auto"
                      />
                    ) : (
                      <video
                        src={item.url}
                        controls
                        className="w-full h-auto"
                        poster={item.url.replace(/\.\w+$/, ".jpg")}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

           

            {/* Featured pets */}
            {post.petIds && post.petIds.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-medium mb-3">Đang ở cùng với:</h3>
                <div className="flex flex-wrap gap-4">
                  {post.petIds.map((pet) => (
                    <Link
                      key={pet._id}
                      to={`/pets/${pet._id}`}
                      className="flex flex-col items-center space-y-1 hover:opacity-80 transition-opacity"
                    >
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={pet.profilePicture?.url}
                          alt={pet.name}
                        />
                        <AvatarFallback>{pet.name?.[0] || "P"}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{pet.name}</span>
                      <span className="text-xs text-gray-500">
                        {pet.breed || pet.species}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comments section */}
        <div>
          {/* Post stats */}
          <div className="flex items-center justify-between py-4">
            <div className="flex space-x-6">
              <div className="flex items-center text-gray-500">
                <Heart className="mr-1.5 h-5 w-5" />
                <span>{post.stats.likeCount || 0}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <MessageSquare className="mr-1.5 h-5 w-5" />
                <span>{post.stats.commentCount || 0}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Eye className="mr-1.5 h-5 w-5" />
                <span>{post.stats.viewCount || 0} lượt xem</span>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="mr-1.5 h-5 w-5" />
              Chia sẽ
            </Button>
          </div>
          {/* Reaction buttons */}
          {user && (
            <ReactionButton
              contentType="posts"
              contentId={post._id}
              currentUser={{
                _id: user?._id,
              }}
            />
          )}

          <Card className="border-none shadow-none p-0 flex flex-col gap-2">
            <CardHeader className="px-0">
              <CardTitle className="text-xl">Bình luận</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              {user ? (
                 <CommentList
                   currentUser={{
                     _id: user?._id,
                     role: user?.role,
                   }}
                   postId={post._id}
                 />
              ) : (
                // <CommentForm postId={post._id} />
                <div className="text-center p-4 border rounded-md">
                  <p className="mb-2">Vui lòng đăng nhập để xem bài viết</p>
                  <Button asChild>
                    <Link to="/sign-in">Đăng nhập</Link>
                  </Button>
                </div>
              )}

              
            </CardContent>
          </Card>
        </div>

        {/* Report dialog */}
        <AlertDialog
          open={isReportDialogOpen}
          onOpenChange={setIsReportDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Báo cáo bài viết</AlertDialogTitle>
              <AlertDialogDescription>
                Vui lòng chọn lý do báo cáo bài đăng này. Người kiểm duyệt của
                chúng tôi sẽ xem xét báo cáo của bạn và thực hiện hành động
                thích hợp.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Lý do:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "spam", label: "Lặp lại" },
                    { value: "harassment", label: "Quấy rối" },
                    { value: "hate-speech", label: "Ngôn từ không chuẩn mực" },
                    {
                      value: "inappropriate-content",
                      label: "Nội dung không phù hợp",
                    },
                    { value: "violence", label: "Bạo lực" },
                    { value: "copyright", label: "Vi phạm bản quyền" },
                    { value: "other", label: "Khác" },
                  ].map(({ value, label }) => (
                    <Button
                      key={value}
                      type="button"
                      variant={reportReason === value ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setReportReason(value)}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="report-details" className="text-sm font-medium">
                  Nội dung báo cáo:
                </label>
                <textarea
                  id="report-details"
                  rows={3}
                  placeholder="Vui lòng cung cấp thêm bối cảnh cho báo cáo này..."
                  className="w-full min-h-[80px] rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                />
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReport}>
                Gửi báo cáo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default PostDetailPage;
