import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Bookmark, 
  MoreHorizontal, 
  Share2, 
  Smile,
  Loader2,
  Trash2,
  Edit,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useGetPostDetail } from '@/features/post/hooks/queries/get-post';
import { useAuthContext } from '@/context/auth-provider';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeletePost } from '@/features/post/hooks/mutations/use-delete-post';
import { useConfirm } from '@/hooks/use-confirm';
import { cn } from '@/lib/utils';
import { ReactionButton } from '@/features/reaction/components/reaction-button';
import { ReactionsDialog } from '@/features/reaction/components/reaction-dialog';
import { usePostComments, usePostPermissions } from '../hooks/post-details-hooks';
import ReportPostDialog from './report-dialog';
import { CommentList } from '@/features/comment/components/comment-list';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShareModal } from './shared-modal';
import SimpleImageCarousel from '@/components/shared/image-carousel';

const PostDetails = () => {
  const { postId = '' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { mutate: deletePost } = useDeletePost();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Xóa bài viết",
    "Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
  );
  
  // UI states
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [isOpenShareModal, setIsOpenShareModal] = useState(false);
  
  // Fetch post data
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useGetPostDetail(postId);
  
  const {
    newComment,
    setNewComment,
    isSubmitting,
    handleSubmitComment
  } = usePostComments(postId);
  
  const post = data?.post;
  const { canModify } = usePostPermissions(post ?? null);
  
  // Early returns for loading and error states
  if (isLoading) return <PostDetailSkeleton />;
  if (isError) return <PostDetailError error={error as Error} />;
  if (!data || !post) return <PostDetailNotFound />;
  
  // Determine if content is long and needs expansion toggle
  const isLongContent = post.content && post.content.length > 300;
  const displayContent = isLongContent && !isContentExpanded 
    ? post.content.substring(0, 300) + '...' 
    : post.content;
  
  // Handle post deletion
  const handleDeletePost = async () => {
    const confirmed = await confirmDelete();
    if (!confirmed) return;
    
    deletePost(postId, {
      onSuccess: () => {
        toast.success("Bài viết đã được xóa");
        navigate(-1);
      }
    });
  };
  


  return (
    <>
      <ShareModal
        isOpen={isOpenShareModal}
        onOpenChange={setIsOpenShareModal}
        title={post.title || ""}
        url={`${window.location.origin}/posts/${postId}`}
      />
      <DeleteDialog />
      {showReportDialog && (
        <ReportPostDialog
          postId={postId}
          open={showReportDialog}
          onOpenChange={setShowReportDialog}
        />
      )}

      <div className="bg-white shadow-sm rounded-md overflow-hidden">
        {/* Post Header - Always visible */}
        <div className="flex items-center p-4 border-b border-slate-200">
          <Link
            to={`/profile/${post.authorId._id}`}
            className="flex items-center"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.authorId.profilePicture?.url || ""} />
              <AvatarFallback className="bg-primary text-white text-sm">
                {post.authorId.fullName
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium hover:underline">
                {post.authorId.fullName}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </p>
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canModify && (
                <>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate(`/posts/${postId}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa bài viết
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500 cursor-pointer"
                    onClick={handleDeletePost}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa bài viết
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setIsOpenShareModal(true)}
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
        </div>

        {/* Flexible layout for mobile vs desktop */}
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Media carousel (larger on mobile, smaller on desktop) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-black/5">
            <SimpleImageCarousel media={post.media} aspectRatio='aspect-square' />
          </div>

          {/* Right side - Tabbed content area */}
          <div className="p-2 w-full lg:w-1/2 flex flex-col h-full border-l border-slate-200">
            {/* Tabs for Content/Comments on mobile */}
            <Tabs
              defaultValue="content"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-0 bg-gray-100">
                <TabsTrigger value="content">Nội dung</TabsTrigger>
                <TabsTrigger value="comments">Bình luận</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="m-0">
                <div className="p-4">
                  {/* Title if available */}
                  {post.title && (
                    <h2 className="text-xl font-medium mb-3">{post.title}</h2>
                  )}

                  {/* Post content */}
                  <div className="prose max-w-none mb-4">
                    <p className="whitespace-pre-wrap text-gray-800">
                      {displayContent}
                    </p>

                    {isLongContent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsContentExpanded(!isContentExpanded)}
                        className="mt-2 text-gray-500 flex items-center gap-1"
                      >
                        {isContentExpanded ? (
                          <>
                            Thu gọn <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Xem thêm <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Pet tags */}
                  {post.petIds && post.petIds.length > 0 && (
                    <Card className="mb-4 bg-orange-50 border-orange-100">
                      <CardContent className="p-3">
                        <h3 className="text-sm font-medium mb-2">
                          Thú cưng được đề cập:
                        </h3>
                        <div className="space-y-2">
                          {post.petIds.map((pet) => (
                            <div key={pet._id} className="flex items-center">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={pet.profilePicture?.url || ""}
                                />
                                <AvatarFallback className="bg-orange-300 text-white text-xs">
                                  {pet.name?.substring(0, 2) || "P"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-3">
                                <p className="text-sm font-medium">
                                  {pet.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {pet.breed} ({pet.species})
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag, index) => (
                        <Link
                          key={index}
                          to={`/tags/${tag}`}
                          className="text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-100"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent
                value="comments"
                className="m-0 max-h-[40vh] lg:max-h-[50vh] overflow-y-auto"
              >
                <div className="p-4">
                  <CommentList postId={postId} currentUser={user} />
                </div>
              </TabsContent>
            </Tabs>

            {/* Interaction bar */}
            <div className="px-4 py-3 border-t border-slate-200 mt-auto">
              <div className="flex justify-between mb-2">
                <div className="flex gap-2">
                  {/* Updated reaction button */}
                  <ReactionButton
                    contentType="post"
                    contentId={postId}
                    currentUser={user}
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700"
                    onClick={() => {
                      setActiveTab("comments");
                      // Focus comment input field with slight delay
                      setTimeout(() => {
                        document.getElementById("comment-input")?.focus();
                      }, 100);
                    }}
                  >
                    <MessageCircle className="h-5 w-5 mr-1" />
                    <span>Bình luận</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700"
                    onClick={() => setIsOpenShareModal(true)}
                  >
                    <Share2 className="h-5 w-5 mr-1" />
                    <span>Chia sẻ</span>
                  </Button>
                </div>

                <Button variant="ghost" size="sm" className="text-gray-700">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>

              {/* Reactions dialog */}
              <div className="mb-3">
                <ReactionsDialog contentType="post" contentId={postId} />
              </div>

              <p className="text-xs text-gray-500 mb-1">
                {format(new Date(post.createdAt), "MMMM dd, yyyy", {
                  locale: vi,
                })}
              </p>
            </div>

            {/* Comment form */}
            <form
              onSubmit={handleSubmitComment}
              className="flex items-center px-4 py-3 border-t border-slate-200"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-gray-500"
              >
                <Smile className="h-5 w-5" />
              </Button>
              <Input
                id="comment-input"
                type="text"
                placeholder="Thêm bình luận..."
                className="border-0 shadow-none focus-visible:ring-0 flex-1 px-2"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={!user || isSubmitting}
              />
              <Button
                type="submit"
                variant="ghost"
                className={cn(
                  "font-medium",
                  newComment.trim() && !isSubmitting
                    ? "text-primary"
                    : "text-primary/50"
                )}
                disabled={!newComment.trim() || isSubmitting || !user}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Đăng"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

// Loading skeleton
const PostDetailSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto bg-white shadow-sm rounded-md overflow-hidden">
      {/* Header skeleton */}
      <div className="flex items-center p-4 border-b border-slate-200">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="ml-3">
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-8 w-8 ml-auto rounded-full" />
      </div>
      
      <div className="flex flex-col lg:flex-row">
        {/* Left side - Image skeleton */}
        <div className="w-full lg:w-1/2 bg-gray-100 aspect-square lg:aspect-auto lg:min-h-[60vh]">
          <Skeleton className="h-full w-full" />
        </div>
        
        {/* Right side - Content skeleton */}
        <div className="p-4 w-full lg:w-1/2 flex flex-col h-full border-l border-slate-200">
          {/* Tabs skeleton */}
          <div className="grid grid-cols-2 p-2 bg-gray-100">
            <Skeleton className="h-10 mx-1" />
            <Skeleton className="h-10 mx-1" />
          </div>
          
          {/* Content skeleton */}
          <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            
            <Skeleton className="h-24 w-full mb-4 rounded-lg" />
            
            <div className="flex flex-wrap gap-1 mb-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </div>
          
          {/* Actions skeleton */}
          <div className="px-4 py-3 border-t border-slate-200 mt-auto">
            <div className="flex mb-2">
              <Skeleton className="h-8 w-8 mr-2" />
              <Skeleton className="h-8 w-20 mr-2" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8 ml-auto" />
            </div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
          
          {/* Comment form skeleton */}
          <div className="flex items-center px-4 py-3 border-t border-slate-200">
            <Skeleton className="h-8 w-8 mr-2" />
            <Skeleton className="flex-1 h-10" />
            <Skeleton className="h-8 w-16 ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Error state component
const PostDetailError = ({ error }: { error: Error }) => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-sm text-center my-8">
      <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2">Không thể tải bài viết</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <div className="flex justify-center gap-4">
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
        <Button variant="outline" onClick={() => navigate(0)}>Thử lại</Button>
      </div>
    </div>
  );
};

// Not found state component
const PostDetailNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-sm text-center my-8">
      <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2">Không tìm thấy bài viết</h2>
      <p className="text-gray-600 mb-4">Bài viết này không tồn tại hoặc đã bị xóa.</p>
      <Button onClick={() => navigate(-1)}>Quay lại</Button>
    </div>
  );
};

export default PostDetails;