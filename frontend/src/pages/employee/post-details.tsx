import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  Flag, 
  Share2,
  AlertTriangle,
  Star
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PostFormDialog } from "@/features/post/components/post-management/post-form-dialog";
import { ModerationDialog } from "@/features/post/components/post-management/moderation-dialog";
import { ReportItem } from "@/features/post/components/post-management/report-item";
import { PostStatusBadge } from "@/features/post/components/post-status-badge";
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
import { useGetPostDetail } from "@/features/post/hooks/queries/get-post";
import { useSetPostFeatureMutation } from "@/features/post/hooks/mutations/set-post-feature";
import { useUpdatePostStatusMutation } from "@/features/post/hooks/mutations/update-post-status";
import { useDeletePost } from "@/features/post/hooks/mutations/use-delete-post";
import { useResolveReportMutation } from "@/features/post/hooks/mutations/resolve-report-post";
import { useUpdatePostMutation } from "@/features/post/hooks/mutations/update-post";
import { toast } from "sonner";

export default function EmployeePostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  
  // Fetch post data
  const { data, isLoading, error, refetch } = useGetPostDetail(postId || "");
  
  // Mutations
  const deletePostMutation = useDeletePost();
  const updateStatusMutation = useUpdatePostStatusMutation();
  const setFeatureMutation = useSetPostFeatureMutation();
  const resolveReportMutation = useResolveReportMutation();
  const updatePostMutation = useUpdatePostMutation();
  
  // Dialog states
  const [postFormOpen, setPostFormOpen] = useState(false);
  const [moderationDialogOpen, setModerationDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("comments");
  
  // Handle back button
  const handleBack = () => {
    navigate(-1);
  };
  
  // Handle edit post
  const handleEdit = () => {
    setPostFormOpen(true);
  };
  
  // Handle post form submit
  const handlePostFormSubmit = (formData: FormData) => {
    if (!postId) return;
    
    updatePostMutation.mutate(
      { id: postId, postData: formData },
      {
        onSuccess: () => {
          toast.success("Bài viết đã được cập nhật");
          setPostFormOpen(false);
          refetch();
        },
        onError: (error) => {
          toast.error("Cập nhật bài viết thất bại");
          console.error("Lỗi cập nhật:", error);
        },
      }
    );
  };
  
  // Handle moderate post
  const handleModerate = () => {
    setModerationDialogOpen(true);
  };
  
  // Handle delete post
  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (!postId) return;
    
    deletePostMutation.mutate(postId, {
      onSuccess: () => {
        toast.success("Bài viết đã được xóa");
        navigate("/employee/posts");
      },
      onError: (error) => {
        toast.error("Xóa bài viết thất bại");
        console.error("Lỗi xóa:", error);
      },
    });
  };
  
  // Handle update post status
  const handleUpdateStatus = (postId: string, status: string, moderationNote: string) => {
    updateStatusMutation.mutate(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { id: postId, status: status as any, moderationNote },
      {
        onSuccess: () => {
          toast.success("Trạng thái bài viết đã được cập nhật");
          setModerationDialogOpen(false);
          refetch();
        },
        onError: (error) => {
          toast.error("Cập nhật trạng thái bài viết thất bại");
          console.error("Lỗi cập nhật trạng thái:", error);
        },
      }
    );
  };
  
  // Handle set post as featured
  const handleSetFeatured = (featured: boolean) => {
    if (!postId) return;
    
    setFeatureMutation.mutate(
      { id: postId, featured },
      {
        onSuccess: () => {
          toast.success(featured ? "Bài viết đã được đánh dấu nổi bật" : "Đã bỏ đánh dấu nổi bật");
          refetch();
        },
        onError: (error) => {
          toast.error("Cập nhật trạng thái nổi bật thất bại");
          console.error("Lỗi cập nhật trạng thái nổi bật:", error);
        },
      }
    );
  };
  
  // Handle resolve report
  const handleResolveReport = (reportId: string, status: 'resolved' | 'rejected', response: string) => {
    if (!postId || !data?.post) return;
    
    resolveReportMutation.mutate(
      { postId, reportId, status, response },
      {
        onSuccess: () => {
          toast.success(status === 'resolved' ? "Báo cáo đã được giải quyết" : "Báo cáo đã bị từ chối");
          refetch();
          
          // If this was the last pending report and we're on the reports tab,
          // show a success message and potentially switch tabs
          const pendingReports = data.post.reports?.filter(r => r.status === 'pending') || [];
          if (pendingReports.length <= 1 && activeTab === "reports") {
            toast.success("Tất cả báo cáo đã được xử lý");
          }
        },
        onError: (error) => {
          toast.error("Xử lý báo cáo thất bại");
          console.error("Lỗi xử lý báo cáo:", error);
        }
      }
    );
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="py-20 text-center text-gray-500">
          Đang tải thông tin bài viết...
        </div>
      </div>
    );
  }
  
  if (error || !data?.post) {
    return (
      <div className="container mx-auto py-6">
        <div className="py-20 text-center text-red-500">
          Lỗi khi tải thông tin bài viết. Bài viết có thể đã bị xóa hoặc bạn không có quyền xem.
        </div>
        <div className="text-center">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        </div>
      </div>
    );
  }
  
  const { post, comments } = data;
  const author = typeof post.authorId === 'object' ? post.authorId : { fullName: 'Không xác định', profilePicture: {url: ""} };
  const createdAt = new Date(post.createdAt);
  
  // Count pending reports
  const pendingReportsCount = post.reports?.filter(report => report.status === 'pending').length || 0;
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleModerate}>
            <AlertTriangle className="mr-2 h-4 w-4" /> Kiểm duyệt
          </Button>
          
          <Button 
            variant={post.isFeatured ? "default" : "ghost"}
            size="sm" 
            onClick={() => handleSetFeatured(!post.isFeatured)}
          >
            <Star className="mr-2 h-4 w-4" /> 
            {post.isFeatured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
          </Button>
          
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Xóa
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 mb-4">
              {author.profilePicture?.url ? (
                <img 
                  src={author.profilePicture.url} 
                  alt={author.fullName} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">{author.fullName.charAt(0)}</span>
                </div>
              )}
              <div>
                <p className="font-medium">{author.fullName}</p>
                <p className="text-sm text-gray-500">
                  {format(createdAt, "PPP 'lúc' p", { locale: vi })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <PostStatusBadge status={post.status} />
              {post.isFeatured && (
                <Badge className="bg-purple-500">Nổi bật</Badge>
              )}
            </div>
          </div>
          
          {post.title && (
            <h1 className="text-2xl font-bold mb-3">{post.title}</h1>
          )}
          
          <div className="mb-6 whitespace-pre-line">{post.content}</div>
          
          {post.media && post.media.length > 0 && (
            <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {post.media.map((item, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  {item.type === 'image' ? (
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Video</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          
          <Separator className="my-4" />
          
          <div className="flex justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.stats.viewCount} lượt xem</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.stats.likeCount} lượt thích</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{post.stats.commentCount} bình luận</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                <span>{post.stats.shareCount} chia sẻ</span>
              </div>
            </div>
            
            {post.stats.reportCount && post.stats.reportCount > 0 && (
              <div className="flex items-center gap-1 text-red-500">
                <Flag className="w-4 h-4" />
                <span>{post.stats.reportCount} báo cáo</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="comments" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="comments">Bình luận ({comments.length})</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo ({post.reports?.length || 0}){pendingReportsCount > 0 && ` (${pendingReportsCount} chờ xử lý)`}</TabsTrigger>
          <TabsTrigger value="history">Lịch sử kiểm duyệt ({post.moderationNotes?.length || 0})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comments" className="space-y-4 py-4">
          {comments.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              Chưa có bình luận nào.
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {comment.authorId.profilePicture?.url ? (
                        <img 
                          src={comment.authorId.profilePicture.url} 
                          alt={comment.authorId.fullName} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">{comment.authorId.fullName.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{comment.authorId.fullName}</p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700">{comment.content}</p>
                    
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 pl-6 border-l-2 border-gray-100 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply._id} className="pt-2">
                            <div className="flex items-center gap-2 mb-1">
                              {reply.authorId.profilePicture?.url ? (
                                <img 
                                  src={reply.authorId.profilePicture.url} 
                                  alt={reply.authorId.fullName} 
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500 text-xs">{reply.authorId.fullName.charAt(0)}</span>
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-xs">{reply.authorId.fullName}</p>
                                <p className="text-xs text-gray-500">
                                  {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: vi })}
                                </p>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 text-sm">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4 py-4">
          {!post.reports || post.reports.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              Không có báo cáo nào về bài viết này.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Show pending reports first */}
              {post.reports
                .filter(report => report.status === 'pending')
                .map((report) => (
                  <ReportItem 
                    key={report._id} 
                    report={report}
                    onResolve={(reportId, status, response) => 
                      handleResolveReport(reportId, status, response)
                    }
                  />
                ))
              }
              
              {/* Then show resolved/rejected reports */}
              {post.reports
                .filter(report => report.status !== 'pending')
                .map((report) => (
                  <ReportItem 
                    key={report._id} 
                    report={report}
                    onResolve={(reportId, status, response) => 
                      handleResolveReport(reportId, status, response)
                    }
                  />
                ))
              }
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 py-4">
          {!post.moderationNotes || post.moderationNotes.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              Không có lịch sử kiểm duyệt cho bài viết này.
            </div>
          ) : (
            <div className="space-y-4">
              {post.moderationNotes.map((note, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <p className="font-medium mb-1">
                      ID Người kiểm duyệt: {note.moderatorId}
                    </p>
                    <p className="text-gray-700 mb-2">{note.note}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(note.createdAt), "PPP 'lúc' p", { locale: vi })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Post Form Dialog */}
      <PostFormDialog 
        open={postFormOpen}
        onOpenChange={setPostFormOpen}
        post={post}
        onSubmit={handlePostFormSubmit}
        isSubmitting={updatePostMutation.isPending}
      />
      
      {/* Moderation Dialog */}
      <ModerationDialog
        open={moderationDialogOpen}
        onOpenChange={setModerationDialogOpen}
        post={post}
        onUpdateStatus={handleUpdateStatus}
        onResolveReport={(_, reportId, status, response) => 
          handleResolveReport(reportId, status, response)
        }
        isSubmitting={updateStatusMutation.isPending || resolveReportMutation.isPending}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa vĩnh viễn bài viết và tất cả dữ liệu liên quan.
              Không thể hoàn tác hành động này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {deletePostMutation.isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}