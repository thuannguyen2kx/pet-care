/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostQueryParams } from "@/features/post/types/api.types"; 
import { PostListTable } from "@/features/post/components/post-management/post-table";
import { Pagination } from "@/features/post/components/post-management/pagination";
import { PostFilterBar } from "@/features/post/components/post-management/filter-bar";
import { PostFormDialog } from "@/features/post/components/post-management/post-form-dialog";
import { ModerationDialog } from "@/features/post/components/post-management/moderation-dialog";
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
import { PostType } from "@/features/post/types/api.types";
import { toast } from "sonner";
import { usePostsQuery } from "@/features/post/hooks/queries/get-posts";
import { usePostsForModerationQuery } from "@/features/post/hooks/queries/get-moderation-post";
import { useReportedPostsQuery } from "@/features/post/hooks/queries/get-report-post";
import { useCreatePost } from "@/features/post/hooks/mutations/use-create-post";
import { useUpdatePostStatusMutation } from "@/features/post/hooks/mutations/update-post-status";
import { useSetPostFeatureMutation } from "@/features/post/hooks/mutations/set-post-feature";
import { useResolveReportMutation } from "@/features/post/hooks/mutations/resolve-report-post";
import { useDeletePost } from "@/features/post/hooks/mutations/use-delete-post";
import { useUpdatePostMutation } from "@/features/post/hooks/mutations/update-post";

export default function EmployeePostsPage() {
  const navigate = useNavigate();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState("all-posts");
  
  // Query parameters for different tabs
  const [allPostsParams, setAllPostsParams] = useState<PostQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortDirection: "desc"
  });
  
  const [moderationParams, setModerationParams] = useState<PostQueryParams>({
    page: 1,
    limit: 10,
    status: "pending",
    sortBy: "createdAt",
    sortDirection: "desc"
  });
  
  const [reportedParams, setReportedParams] = useState<PostQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "reportCount",
    sortDirection: "desc",
    status: "pending"
  });
  
  // Fetch data for each tab
  const allPostsQuery = usePostsQuery(allPostsParams);
  const moderationQuery = usePostsForModerationQuery(moderationParams);
  const reportedQuery = useReportedPostsQuery(reportedParams);
  
  // Mutations
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePostMutation();
  const deletePostMutation = useDeletePost();
  const updateStatusMutation = useUpdatePostStatusMutation();
  const setFeatureMutation = useSetPostFeatureMutation();
  const resolveReportMutation = useResolveReportMutation();
  
  // Dialog states
  const [postFormOpen, setPostFormOpen] = useState(false);
  const [moderationDialogOpen, setModerationDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostType | undefined>(undefined);
  
  // Handle view post
  const handleViewPost = (post: PostType) => {
    navigate(`/employee/posts/${post._id}`);
  };
  
  // Handle edit post
  const handleEditPost = (post: PostType) => {
    setSelectedPost(post);
    setPostFormOpen(true);
  };
  
  // Handle create new post
  const handleCreateNew = () => {
    setSelectedPost(undefined);
    setPostFormOpen(true);
  };
  
  // Handle post form submit
  const handlePostFormSubmit = (formData: FormData) => {
    if (selectedPost) {
      // Update existing post
      updatePostMutation.mutate(
        { id: selectedPost._id, postData: formData },
        {
          onSuccess: () => {
            toast.success("Đã cập nhật bài viết thành công");
            setPostFormOpen(false);
            refreshCurrentTabData();
          },
          onError: (error) => {
            toast.error("Cập nhật bài viết thất bại");
            console.error("Lỗi cập nhật:", error);
          },
        }
      );
    } else {
      // Create new post
      createPostMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Đã tạo bài viết thành công");
          setPostFormOpen(false);
          refreshCurrentTabData();
        },
        onError: (error) => {
          toast.error("Tạo bài viết thất bại");
          console.error("Lỗi tạo mới:", error);
        },
      });
    }
  };
  
  // Refresh data based on the currently active tab
  const refreshCurrentTabData = () => {
    switch (activeTab) {
      case "all-posts":
        allPostsQuery.refetch();
        break;
      case "moderation-queue":
        moderationQuery.refetch();
        break;
      case "reported-posts":
        reportedQuery.refetch();
        break;
    }
  };
  
  // Handle delete post
  const handleDeleteClick = (post: PostType) => {
    setSelectedPost(post);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (!selectedPost) return;
    
    deletePostMutation.mutate(selectedPost._id, {
      onSuccess: () => {
        toast.success("Đã xóa bài viết thành công");
        setDeleteDialogOpen(false);
        refreshCurrentTabData();
      },
      onError: (error) => {
        toast.error("Xóa bài viết thất bại");
        console.error("Lỗi xóa:", error);
      },
    });
  };
  
  // Handle moderate post
  const handleModeratePost = (post: PostType) => {
    setSelectedPost(post);
    setModerationDialogOpen(true);
  };
  
  // Handle update post status
  const handleUpdateStatus = (postId: string, status: string, moderationNote: string) => {
    updateStatusMutation.mutate(
      { id: postId, status: status as any, moderationNote },
      {
        onSuccess: () => {
          toast.success("Đã cập nhật trạng thái bài viết thành công");
          setModerationDialogOpen(false);
          refreshCurrentTabData();
        },
        onError: (error) => {
          toast.error("Cập nhật trạng thái bài viết thất bại");
          console.error("Lỗi cập nhật trạng thái:", error);
        },
      }
    );
  };
  
  // Handle set post as featured
  const handleSetFeatured = (post: PostType, featured: boolean) => {
    setFeatureMutation.mutate(
      { id: post._id, featured },
      {
        onSuccess: () => {
          toast.success(featured ? "Đã đánh dấu bài viết nổi bật" : "Đã bỏ đánh dấu bài viết nổi bật");
          refreshCurrentTabData();
        },
        onError: (error) => {
          toast.error("Cập nhật trạng thái nổi bật thất bại");
          console.error("Lỗi cập nhật trạng thái nổi bật:", error);
        },
      }
    );
  };
  
  // Handle resolve report
  const handleResolveReport = (postId: string, reportId: string, status: 'resolved' | 'rejected', response: string) => {
    resolveReportMutation.mutate(
      { postId, reportId, status, response },
      {
        onSuccess: () => {
          toast.success(status === 'resolved' ? "Đã giải quyết báo cáo" : "Đã từ chối báo cáo");
          refreshCurrentTabData();
        },
        onError: (error) => {
          toast.error("Giải quyết báo cáo thất bại");
          console.error("Lỗi giải quyết báo cáo:", error);
        }
      }
    );
  };
  
  // Handle filter changes
  const handleAllPostsFilterChange = (filters: Partial<PostQueryParams>) => {
    setAllPostsParams({ ...allPostsParams, ...filters, page: 1 });
  };
  
  const handleModerationFilterChange = (filters: Partial<PostQueryParams>) => {
    setModerationParams({ ...moderationParams, ...filters, page: 1 });
  };
  
  const handleReportedFilterChange = (filters: Partial<PostQueryParams>) => {
    setReportedParams({ ...reportedParams, ...filters, page: 1 });
  };
  
  // Handle pagination changes
  const handleAllPostsPageChange = (page: number) => {
    setAllPostsParams({ ...allPostsParams, page });
  };
  
  const handleModerationPageChange = (page: number) => {
    setModerationParams({ ...moderationParams, page });
  };
  
  const handleReportedPageChange = (page: number) => {
    setReportedParams({ ...reportedParams, page });
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" /> Bài viết mới
        </Button>
      </div>
      
      <Tabs defaultValue="all-posts" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all-posts">Tất cả bài viết</TabsTrigger>
          <TabsTrigger value="moderation-queue">Hàng chờ kiểm duyệt</TabsTrigger>
          <TabsTrigger value="reported-posts">Bài viết bị báo cáo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-posts" className="space-y-4">
          <PostFilterBar 
            onFilterChange={handleAllPostsFilterChange}
            initialFilters={allPostsParams}
            showStatusFilter={true}
            showVisibilityFilter={true}
            showSortOptions={true}
          />
          
          {allPostsQuery.isLoading ? (
            <div className="py-10 text-center text-gray-500">Đang tải bài viết...</div>
          ) : allPostsQuery.error ? (
            <div className="py-10 text-center text-red-500">
              Lỗi khi tải bài viết. Vui lòng thử lại.
            </div>
          ) : (
            <>
              {!allPostsQuery.data?.posts || allPostsQuery.data.posts.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  Không tìm thấy bài viết nào. Tạo bài viết mới để bắt đầu!
                </div>
              ) : (
                <>
                  <PostListTable 
                    posts={allPostsQuery.data.posts}
                    onView={handleViewPost}
                    onEdit={handleEditPost}
                    onDelete={handleDeleteClick}
                    onUpdateStatus={handleModeratePost}
                    onSetFeatured={handleSetFeatured}
                  />
                  
                  {allPostsQuery.data.pagination && (
                    <Pagination 
                      pagination={allPostsQuery.data.pagination}
                      onPageChange={handleAllPostsPageChange}
                      onLimitChange={(limit) => 
                        setAllPostsParams({ ...allPostsParams, limit, page: 1 })
                      }
                    />
                  )}
                </>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="moderation-queue" className="space-y-4">
          <PostFilterBar 
            onFilterChange={handleModerationFilterChange}
            initialFilters={moderationParams}
            showStatusFilter={false}
          />
          
          {moderationQuery.isLoading ? (
            <div className="py-10 text-center text-gray-500">Đang tải hàng chờ kiểm duyệt...</div>
          ) : moderationQuery.error ? (
            <div className="py-10 text-center text-red-500">
              Lỗi khi tải hàng chờ kiểm duyệt. Vui lòng thử lại.
            </div>
          ) : (
            <>
              {!moderationQuery.data?.posts || moderationQuery.data.posts.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  Không có bài viết nào trong hàng chờ kiểm duyệt. Tất cả bài viết đều đang hoạt động!
                </div>
              ) : (
                <>
                  <PostListTable 
                    posts={moderationQuery.data.posts}
                    onView={handleViewPost}
                    onEdit={handleEditPost}
                    onDelete={handleDeleteClick}
                    onUpdateStatus={handleModeratePost}
                  />
                  
                  {moderationQuery.data.pagination && (
                    <Pagination 
                      pagination={moderationQuery.data.pagination}
                      onPageChange={handleModerationPageChange}
                      onLimitChange={(limit) => 
                        setModerationParams({ ...moderationParams, limit, page: 1 })
                      }
                    />
                  )}
                </>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="reported-posts" className="space-y-4">
          <PostFilterBar 
            onFilterChange={handleReportedFilterChange}
            initialFilters={reportedParams}
            showStatusFilter={false}
          />
          
          {reportedQuery.isLoading ? (
            <div className="py-10 text-center text-gray-500">Đang tải bài viết bị báo cáo...</div>
          ) : reportedQuery.error ? (
            <div className="py-10 text-center text-red-500">
              Lỗi khi tải bài viết bị báo cáo. Vui lòng thử lại.
            </div>
          ) : (
            <>
              {!reportedQuery.data?.posts || reportedQuery.data.posts.length === 0 ? (
                <div className="py-10 text-center text-gray-500">
                  Không tìm thấy bài viết bị báo cáo. Mọi thứ đều tốt!
                </div>
              ) : (
                <>
                  <PostListTable 
                    posts={reportedQuery.data.posts}
                    onView={handleViewPost}
                    onEdit={handleEditPost}
                    onDelete={handleDeleteClick}
                    onUpdateStatus={handleModeratePost}
                  />
                  
                  {reportedQuery.data.pagination && (
                    <Pagination 
                      pagination={reportedQuery.data.pagination}
                      onPageChange={handleReportedPageChange}
                      onLimitChange={(limit) => 
                        setReportedParams({ ...reportedParams, limit, page: 1 })
                      }
                    />
                  )}
                </>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Post Form Dialog */}
      <PostFormDialog 
        open={postFormOpen}
        onOpenChange={setPostFormOpen}
        post={selectedPost}
        onSubmit={handlePostFormSubmit}
        isSubmitting={createPostMutation.isPending || updatePostMutation.isPending}
      />
      
      {/* Moderation Dialog */}
      <ModerationDialog
        open={moderationDialogOpen}
        onOpenChange={setModerationDialogOpen}
        post={selectedPost}
        onUpdateStatus={handleUpdateStatus}
        onResolveReport={handleResolveReport}
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