/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Filter,
  RefreshCw,
  ListFilter,
  Clock,
  Flag,
  FileText,
  Info,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostQueryParams } from "@/features/post/types/api.types";
import { PostListTable } from "@/features/post/components/post-management/post-table";
import { Pagination } from "@/features/post/components/post-management/pagination";
import { PostFilterBar } from "@/features/post/components/post-management/filter-bar";
import { PostFormDialog } from "@/features/post/components/post-management/post-form-dialog";
import { ModerationDialog } from "@/features/post/components/post-management/moderation-dialog";
import { PostType } from "@/features/post/types/api.types";
import { usePostsQuery } from "@/features/post/hooks/queries/get-posts";
import { usePostsForModerationQuery } from "@/features/post/hooks/queries/get-moderation-post";
import { useReportedPostsQuery } from "@/features/post/hooks/queries/get-report-post";
import { useCreatePost } from "@/features/post/hooks/mutations/use-create-post";
import { useUpdatePostStatusMutation } from "@/features/post/hooks/mutations/update-post-status";
import { useSetPostFeatureMutation } from "@/features/post/hooks/mutations/set-post-feature";
import { useResolveReportMutation } from "@/features/post/hooks/mutations/resolve-report-post";
import { useDeletePost } from "@/features/post/hooks/mutations/use-delete-post";
import { useUpdatePostMutation } from "@/features/post/hooks/mutations/update-post";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";

export default function PostsManagerPage() {
  const navigate = useNavigate();

  // State for active tab
  const [activeTab, setActiveTab] = useState("all-posts");

  // State for filter visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Query parameters for different tabs
  const [allPostsParams, setAllPostsParams] = useState<PostQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  const [moderationParams, setModerationParams] = useState<PostQueryParams>({
    page: 1,
    limit: 10,
    status: "under-review",
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  const [reportedParams, setReportedParams] = useState<PostQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "reportCount",
    sortDirection: "desc",
    status: "pending",
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
  const [selectedPost, setSelectedPost] = useState<PostType | undefined>(
    undefined
  );
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Xác nhận xoá bài viết",
    "Hành động này sẽ xóa vĩnh viễn bài viết và tất cả dữ liệu liên quan. Không thể hoàn tác hành động này."
  );
  // Handle view post
  const handleViewPost = (post: PostType) => {
    navigate(`/manager/posts/${post._id}`);
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
  const handleDeletePost = async (postId: string) => {
    const ok = await confirmDelete();
    if (!ok) return;

    deletePostMutation.mutate(postId, {
      onSuccess: () => {
        refreshCurrentTabData();
      }, 
    });
  };

  // Handle moderate post
  const handleModeratePost = (post: PostType) => {
    setSelectedPost(post);
    setModerationDialogOpen(true);
  };

  // Handle update post status
  const handleUpdateStatus = (
    postId: string,
    status: string,
    moderationNote: string
  ) => {
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
          toast.success(
            featured
              ? "Đã đánh dấu bài viết nổi bật"
              : "Đã bỏ đánh dấu bài viết nổi bật"
          );
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
  const handleResolveReport = (
    postId: string,
    reportId: string,
    status: "resolved" | "rejected",
    response: string
  ) => {
    resolveReportMutation.mutate(
      { postId, reportId, status, response },
      {
        onSuccess: () => {
          toast.success(
            status === "resolved"
              ? "Đã giải quyết báo cáo"
              : "Đã từ chối báo cáo"
          );
          refreshCurrentTabData();
        },
        onError: (error) => {
          toast.error("Giải quyết báo cáo thất bại");
          console.error("Lỗi giải quyết báo cáo:", error);
        },
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

  // Get the current query based on active tab
  const getCurrentQuery = () => {
    switch (activeTab) {
      case "all-posts":
        return allPostsQuery;
      case "moderation-queue":
        return moderationQuery;
      case "reported-posts":
        return reportedQuery;
      default:
        return allPostsQuery;
    }
  };

  // Loader component
  const TableSkeleton = () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-4 mt-6">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>
      ))}
    </div>
  );

  // Render current filter bar based on active tab
  const renderFilterBar = () => {
    switch (activeTab) {
      case "all-posts":
        return (
          <PostFilterBar
            onFilterChange={handleAllPostsFilterChange}
            initialFilters={allPostsParams}
            showStatusFilter={true}
            showVisibilityFilter={true}
            showSortOptions={true}
          />
        );
      case "moderation-queue":
        return (
          <PostFilterBar
            onFilterChange={handleModerationFilterChange}
            initialFilters={moderationParams}
            showStatusFilter={false}
          />
        );
      case "reported-posts":
        return (
          <PostFilterBar
            onFilterChange={handleReportedFilterChange}
            initialFilters={reportedParams}
            showVisibilityFilter={false}
            showStatusFilter={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-1 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Quản lý bài viết
          </h1>
          <p className="text-muted-foreground">
            Quản lý, kiểm duyệt và tương tác với bài viết người dùng
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Collapsible>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <ListFilter className="h-4 w-4" />
                  <span className="hidden sm:inline">Tùy chọn</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="cursor-pointer"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {isFilterOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={refreshCurrentTabData}
                  disabled={getCurrentQuery().isFetching}
                  className="cursor-pointer"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${
                      getCurrentQuery().isFetching ? "animate-spin" : ""
                    }`}
                  />
                  Làm mới dữ liệu
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/employee/posts/analytics")}
                  className="cursor-pointer"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Xem thống kê
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Collapsible>

          <Button
            onClick={handleCreateNew}
            className="gap-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Tạo bài viết</span>
            <span className="sm:hidden">Tạo mới</span>
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-none p-0">
        <CardHeader className="pb-0 pt-6 px-6 bg-muted/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
            <div>
              <CardTitle className="text-lg">Danh sách bài viết</CardTitle>
              <CardDescription>Tất cả bài viết trong hệ thống</CardDescription>
            </div>
          </div>

          <Tabs
            defaultValue="all-posts"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="all-posts"
                className="flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FileText className="h-4 w-4" />
                <span>Tất cả bài viết</span>
                {!allPostsQuery.isLoading &&
                  allPostsQuery.data?.pagination?.totalPosts && (
                    <Badge variant="secondary" className="ml-auto">
                      {allPostsQuery.data.pagination.totalPosts}
                    </Badge>
                  )}
              </TabsTrigger>
              <TabsTrigger
                value="moderation-queue"
                className="flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Clock className="h-4 w-4" />
                <span>Chờ duyệt</span>
                {!moderationQuery.isLoading &&
                  moderationQuery.data?.pagination?.totalPosts && (
                    <Badge variant="secondary" className="ml-auto">
                      {moderationQuery.data.pagination.totalPosts}
                    </Badge>
                  )}
              </TabsTrigger>
              <TabsTrigger
                value="reported-posts"
                className="flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Flag className="h-4 w-4" />
                <span>Bị báo cáo</span>
                {!reportedQuery.isLoading &&
                  reportedQuery.data?.pagination?.totalPosts && (
                    <Badge
                      variant={
                        reportedQuery.data.pagination.totalPosts > 0
                          ? "destructive"
                          : "secondary"
                      }
                      className="ml-auto"
                    >
                      {reportedQuery.data.pagination.totalPosts}
                    </Badge>
                  )}
              </TabsTrigger>
            </TabsList>

            <CardContent className="px-6 py-6">
              <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <CollapsibleTrigger asChild className="sm:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mb-4 w-full flex justify-between items-center"
                  >
                    <span>Bộ lọc nâng cao</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isFilterOpen && "transform rotate-180"
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 pb-4 mb-4 border-b border-slate-300">
                  {renderFilterBar()}
                </CollapsibleContent>
              </Collapsible>

              <TabsContent value="all-posts" className="mt-0 space-y-4">
                {allPostsQuery.isLoading ? (
                  <TableSkeleton />
                ) : allPostsQuery.error ? (
                  <div className="py-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                      <Info className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Không thể tải dữ liệu
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Đã xảy ra lỗi khi tải bài viết. Vui lòng thử lại sau.
                    </p>
                    <Button
                      onClick={refreshCurrentTabData}
                      variant="outline"
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Thử lại
                    </Button>
                  </div>
                ) : (
                  <>
                    {!allPostsQuery.data?.posts ||
                    allPostsQuery.data.posts.length === 0 ? (
                      <div className="py-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">
                          Không có bài viết nào
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Tạo bài viết mới để bắt đầu!
                        </p>
                        <Button
                          onClick={handleCreateNew}
                          className="gap-2 bg-gradient-to-r from-primary to-primary/80"
                        >
                          <Plus className="h-4 w-4" /> Tạo bài viết mới
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-lg overflow-hidden">
                          <PostListTable
                            posts={allPostsQuery.data.posts}
                            onView={handleViewPost}
                            onEdit={handleEditPost}
                            onDelete={handleDeletePost}
                            onUpdateStatus={handleModeratePost}
                            onSetFeatured={handleSetFeatured}
                          />
                        </div>

                        {allPostsQuery.data.pagination && (
                          <div className="mt-6">
                            <Pagination
                              pagination={allPostsQuery.data.pagination}
                              onPageChange={handleAllPostsPageChange}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="moderation-queue" className="mt-0 space-y-4">
                {moderationQuery.isLoading ? (
                  <TableSkeleton />
                ) : moderationQuery.error ? (
                  <div className="py-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                      <Info className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Không thể tải dữ liệu
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Đã xảy ra lỗi khi tải bài viết chờ duyệt. Vui lòng thử lại
                      sau.
                    </p>
                    <Button
                      onClick={refreshCurrentTabData}
                      variant="outline"
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Thử lại
                    </Button>
                  </div>
                ) : (
                  <>
                    {!moderationQuery.data?.posts ||
                    moderationQuery.data.posts.length === 0 ? (
                      <div className="py-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                          <Clock className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">
                          Hàng đợi trống
                        </h3>
                        <p className="text-muted-foreground">
                          Tất cả bài viết đều đã được duyệt!
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-lg overflow-hidden">
                          <PostListTable
                            posts={moderationQuery.data.posts}
                            onView={handleViewPost}
                            onEdit={handleEditPost}
                            onDelete={handleDeletePost}
                            onUpdateStatus={handleModeratePost}
                          />
                        </div>

                        {moderationQuery.data.pagination && (
                          <div className="mt-6">
                            <Pagination
                              pagination={moderationQuery.data.pagination}
                              onPageChange={handleModerationPageChange}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="reported-posts" className="mt-0 space-y-4">
                {reportedQuery.isLoading ? (
                  <TableSkeleton />
                ) : reportedQuery.error ? (
                  <div className="py-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                      <Info className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Không thể tải dữ liệu
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Đã xảy ra lỗi khi tải bài viết bị báo cáo. Vui lòng thử
                      lại sau.
                    </p>
                    <Button
                      onClick={refreshCurrentTabData}
                      variant="outline"
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Thử lại
                    </Button>
                  </div>
                ) : (
                  <>
                    {!reportedQuery.data?.posts ||
                    reportedQuery.data.posts.length === 0 ? (
                      <div className="py-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                          <Flag className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-medium mb-2">
                          Không có báo cáo nào
                        </h3>
                        <p className="text-muted-foreground">
                          Mọi bài viết đều đã được kiểm duyệt!
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-lg overflow-hidden">
                          <PostListTable
                            posts={reportedQuery.data.posts}
                            onView={handleViewPost}
                            onEdit={handleEditPost}
                            onDelete={handleDeletePost}
                            onUpdateStatus={handleModeratePost}
                          />
                        </div>

                        {reportedQuery.data.pagination && (
                          <div className="mt-6">
                            <Pagination
                              pagination={reportedQuery.data.pagination}
                              onPageChange={handleReportedPageChange}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Post Form Dialog */}
      <PostFormDialog
        open={postFormOpen}
        onOpenChange={setPostFormOpen}
        post={selectedPost}
        onSubmit={handlePostFormSubmit}
        isSubmitting={
          createPostMutation.isPending || updatePostMutation.isPending
        }
      />

      {/* Moderation Dialog */}
      <ModerationDialog
        open={moderationDialogOpen}
        onOpenChange={setModerationDialogOpen}
        post={selectedPost}
        onUpdateStatus={handleUpdateStatus}
        onResolveReport={handleResolveReport}
        isSubmitting={
          updateStatusMutation.isPending || resolveReportMutation.isPending
        }
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog />
    </div>
  );
}
