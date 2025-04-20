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
import { PostType} from "@/features/post/types/api.types";
import { ReportItem } from "./report-item";

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

  // Reset form when dialog opens/closes or post changes
  useEffect(() => {
    if (open && post) {
      setStatus(post.status);
      setModerationNote("");
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

  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kiểm duyệt bài viết</DialogTitle>
          <DialogDescription>
            Xem xét và kiểm duyệt bài viết này.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Post summary section */}
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">
              {post.title || "Bài viết không tiêu đề"}
            </h3>
            <p className="text-sm text-gray-700 mb-3">{post.content}</p>
            
            {post.media && post.media.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Media:</p>
                <div className="flex flex-wrap gap-2">
                  {post.media.map((item, index) => (
                    <div key={index} className="w-16 h-16 relative overflow-hidden rounded-md">
                      {item.type === 'image' ? (
                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
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
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Reports section */}
          {post.reports && post.reports.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Báo cáo ({post.reports.length})</h3>
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
              {post.reports.some(report => report.status !== 'pending') && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium mb-2">Báo cáo đã xử lý</h4>
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
          )}
          
          {/* Moderation notes section */}
          {post.moderationNotes && post.moderationNotes.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Lịch sử kiểm duyệt</h3>
              {post.moderationNotes.map((note, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md mb-2">
                  <p className="text-sm text-gray-700">{note.note}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(note.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              ))}
            </div>
          )}
          
          {/* Moderation actions section */}
          <div>
            <h3 className="font-medium mb-3">Hành động kiểm duyệt</h3>
            
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
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="under-review">Đang xét duyệt</SelectItem>
                    <SelectItem value="blocked">Chặn</SelectItem>
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
        </div>
        
        <DialogFooter>
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
            {isSubmitting ? "Đang lưu..." : "Cập nhật kiểm duyệt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}