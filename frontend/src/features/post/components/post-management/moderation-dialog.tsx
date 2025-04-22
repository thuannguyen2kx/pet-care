import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostType } from "@/features/post/types/api.types";
import { ReportItem } from "./report-item";
import { Badge } from "@/components/ui/badge";
import { PostStatusBadge } from "../post-status-badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Flag, Clock, CheckCircle, History, ShieldAlert } from "lucide-react";

interface ModerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: PostType;
  onUpdateStatus: (postId: string, status: string, moderationNote: string) => void;
  onResolveReport: (postId: string, reportId: string, status: 'resolved' | 'rejected', response: string) => void;
  isSubmitting: boolean;
}

export function ModerationDialog({ 
  open, 
  onOpenChange, 
  post, 
  onUpdateStatus,
  onResolveReport,
  isSubmitting 
}: ModerationDialogProps) {
  const [status, setStatus] = useState<string>("active");
  const [moderationNote, setModerationNote] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Reset form when dialog opens/closes or post changes
  useEffect(() => {
    if (open && post) {
      setStatus(post.status);
      setModerationNote("");
      
      // Mặc định chuyển đến tab báo cáo nếu có báo cáo đang chờ xử lý
      const hasPendingReports = post.reports?.some(report => report.status === 'pending');
      if (hasPendingReports) {
        setActiveTab("reports");
      } else {
        setActiveTab("overview");
      }
    }
  }, [open, post]);

  const handleSubmit = () => {
    if (!post) return;
    onUpdateStatus(post._id, status, moderationNote);
  };

  const handleResolveReport = (reportId: string, resolveStatus: 'resolved' | 'rejected', response: string) => {
    if (!post) return;
    onResolveReport(post._id, reportId, resolveStatus, response);
  };

  if (!post) return null;

  // Đếm số báo cáo đang chờ xử lý
  const pendingReportsCount = post.reports?.filter(report => report.status === 'pending').length || 0;

  // Lấy tên trạng thái
  const getStatusName = (status: string) => {
    switch(status) {
      case "active": return "Hoạt động";
      case "under-review": return "Đang xét duyệt";
      case "blocked": return "Đã chặn";
      default: return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Kiểm duyệt bài viết
          </DialogTitle>
          <DialogDescription>
            Xem xét và kiểm duyệt bài viết. Cập nhật trạng thái hoặc phản hồi báo cáo.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Tổng quan</TabsTrigger>
              <TabsTrigger value="reports" className="flex-1">
                Báo cáo {pendingReportsCount > 0 && `(${pendingReportsCount})`}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1">
                Lịch sử ({post.moderationNotes?.length || 0})
              </TabsTrigger>
            </TabsList>
          </div>
        
          <ScrollArea className="h-[60vh] px-6 py-4">
            <TabsContent value="overview" className="m-0">
              {/* Post summary section */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-base">Nội dung bài viết</CardTitle>
                    <PostStatusBadge status={post.status} />
                  </div>
                  <CardDescription>
                    ID: {post._id} • Đăng bởi: {typeof post.authorId === 'object' ? post.authorId.fullName : 'Không xác định'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium mb-2">
                    {post.title || "Bài viết không tiêu đề"}
                  </h3>
                  <p className="text-sm text-gray-700 mb-3 whitespace-pre-line">{post.content}</p>
                  
                  {post.media && post.media.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Media:</p>
                      <div className="grid grid-cols-4 gap-2">
                        {post.media.map((item, index) => (
                          <div key={index} className="aspect-square relative overflow-hidden rounded-md">
                            {item.type === 'image' ? (
                              <img src={item.url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-500 text-xs">Video</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="text-xs"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="border-t border-slate-200 pt-3 text-sm flex justify-between">
                  <div className="flex items-center gap-4">
                    <span>👁️ {post.stats.viewCount}</span>
                    <span>👍 {post.stats.likeCount}</span>
                    <span>💬 {post.stats.commentCount}</span>
                  </div>
                  
                  {post.stats.reportCount && post.stats.reportCount > 0 && (
                    <div className="flex items-center gap-1 text-red-500">
                      <Flag className="h-4 w-4" />
                      <span>{post.stats.reportCount}</span>
                    </div>
                  )}
                </CardFooter>
              </Card>
              
              {/* Moderation actions section */}
              <div className="mt-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  Hành động kiểm duyệt
                </h3>
                
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Cập nhật trạng thái:
                    </label>
                    <Select
                      value={status}
                      onValueChange={setStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Hoạt động</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="under-review">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span>Đang xét duyệt</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="blocked">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4 text-red-500" />
                            <span>Chặn</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Ghi chú kiểm duyệt:
                    </label>
                    <Textarea
                      value={moderationNote}
                      onChange={(e) => setModerationNote(e.target.value)}
                      placeholder="Thêm ghi chú về hành động kiểm duyệt này..."
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="m-0">
              {post.reports && post.reports.length > 0 ? (
                <div className="space-y-4">
                  {/* Pending reports section */}
                  {post.reports.filter(report => report.status === 'pending').length > 0 ? (
                    <div>
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Flag className="h-4 w-4 text-red-500" />
                        Báo cáo chờ xử lý ({post.reports.filter(report => report.status === 'pending').length})
                      </h3>
                      {post.reports
                        .filter(report => report.status === 'pending')
                        .map((report) => (
                          <ReportItem 
                            key={report._id} 
                            report={report} 
                            onResolve={handleResolveReport}
                          />
                        ))
                      }
                    </div>
                  ) : (
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6 text-center">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p>Không có báo cáo nào đang chờ xử lý</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Resolved reports section */}
                  {post.reports.some(report => report.status !== 'pending') && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <History className="h-4 w-4 text-muted-foreground" />
                        Báo cáo đã xử lý ({post.reports.filter(report => report.status !== 'pending').length})
                      </h3>
                      {post.reports
                        .filter(report => report.status !== 'pending')
                        .map((report) => (
                          <ReportItem 
                            key={report._id} 
                            report={report}
                            onResolve={handleResolveReport}
                          />
                        ))
                      }
                    </div>
                  )}
                </div>
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p>Bài viết này chưa nhận được báo cáo nào</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="m-0">
              {post.moderationNotes && post.moderationNotes.length > 0 ? (
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    Lịch sử kiểm duyệt
                  </h3>
                  {post.moderationNotes.map((note, index) => (
                    <Card key={index} className="mb-3">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                          <span>Người kiểm duyệt: {note.moderatorId}</span>
                          <Badge variant="outline">
                            {new Date(note.createdAt).toLocaleString('vi-VN')}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <p className="text-sm whitespace-pre-line">{note.note}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6 text-center">
                    <History className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p>Bài viết này chưa có lịch sử kiểm duyệt</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="px-6 py-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={status === post.status && !moderationNote.trim() || isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : `Lưu thay đổi (${getStatusName(status)})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}