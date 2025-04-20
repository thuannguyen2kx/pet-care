import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { reportPostMutationFn } from "@/features/post/api";
import { ReasonType } from "@/features/post/types/api.types";

interface ReportPostDialogProps {
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const REPORT_REASONS: { value: ReasonType; label: string }[] = [
  { value: "spam", label: "Spam hoặc quảng cáo" },
  { value: "harassment", label: "Quấy rối hoặc bắt nạt" },
  { value: "hate-speech", label: "Phát ngôn thù ghét" },
  { value: "inappropriate-content", label: "Nội dung không phù hợp" },
  { value: "violence", label: "Bạo lực hoặc nguy hiểm" },
  { value: "copyright", label: "Vi phạm bản quyền" },
  { value: "other", label: "Lý do khác" },
];

const ReportPostDialog: React.FC<ReportPostDialogProps> = ({
  postId,
  open,
  onOpenChange,
}) => {
  const [reason, setReason] = useState<ReasonType | null>(null);
  const [details, setDetails] = useState("");

  const reportMutation = useMutation({
    mutationFn: reportPostMutationFn,
    onSuccess: () => {
      toast.success("Cảm ơn bạn đã báo cáo, chúng tôi sẽ xem xét bài viết này");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Không thể báo cáo bài viết. Vui lòng thử lại sau");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      toast.error("Vui lòng chọn lý do báo cáo");
      return;
    }

    reportMutation.mutate({
      id: postId,
      reportData: {
        reason,
        details: details.trim() || undefined,
      },
    });
  };

  const handleClose = () => {
    if (!reportMutation.isPending) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Báo cáo bài viết</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Lý do báo cáo</Label>
              <RadioGroup
                value={reason || ""}
                onValueChange={(value) => setReason(value as ReasonType)}
                className="space-y-2"
              >
                {REPORT_REASONS.map((item) => (
                  <div
                    key={item.value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <RadioGroupItem value={item.value} id={item.value} />
                    <Label
                      htmlFor={item.value}
                      className="cursor-pointer font-normal flex-grow"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="details">Mô tả chi tiết (Không bắt buộc)</Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Cung cấp thêm thông tin về vấn đề..."
                className="resize-none"
                rows={3}
                disabled={reportMutation.isPending}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={reportMutation.isPending}
              >
                Hủy
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!reason || reportMutation.isPending}
            >
              {reportMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Báo cáo"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportPostDialog;