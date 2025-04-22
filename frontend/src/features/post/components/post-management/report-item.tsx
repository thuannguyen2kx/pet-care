import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from "@/components/ui/card";
import { 
  Badge 
} from "@/components/ui/badge";
import {
  Button,
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { ReportType } from "@/features/post/types/api.types";
import { CheckCircle, XCircle, Flag, AlertTriangle, Clock, UserCircle } from "lucide-react";

interface ReportItemProps {
  report: ReportType;
  onResolve: (reportId: string, status: 'resolved' | 'rejected', response: string) => void;
}

export function ReportItem({ report, onResolve }: ReportItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'resolved' | 'rejected'>('resolved');
  const [response, setResponse] = useState('');
  
  const reporter = typeof report.userId === 'object' 
    ? report.userId.fullName 
    : 'Người dùng ID: ' + report.userId;
  
  const createdAt = new Date(report.createdAt);
  
  const getStatusBadge = () => {
    switch(report.status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-500 text-white flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Chờ xử lý</span>
          </Badge>
        );
      case 'resolved':
        return (
          <Badge className="bg-green-500 text-white flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Đã giải quyết</span>
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500 text-white flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Đã từ chối</span>
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const handleSubmit = () => {
    onResolve(report._id, status, response);
    setIsOpen(false);
  };

  const getReasonLabel = (reason: string) => {
    switch(reason) {
      case "spam": return "Spam / Quảng cáo";
      case "harassment": return "Quấy rối";
      case "hate-speech": return "Phát ngôn thù ghét";
      case "violence": return "Bạo lực";
      case "illegal-content": return "Nội dung bất hợp pháp";
      case "misinformation": return "Thông tin sai lệch";
      case "inappropriate": return "Nội dung không phù hợp";
      case "other": return "Lý do khác";
      default: return reason;
    }
  };
  
  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {typeof report.userId === 'object' && report.userId.profilePicture ? (
              <AvatarImage src={report.userId.profilePicture.url || ""} alt={reporter} />
            ) : null}
            <AvatarFallback>
              <UserCircle className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{reporter}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(createdAt, { addSuffix: true, locale: vi })}
            </p>
          </div>
        </div>
        {getStatusBadge()}
      </CardHeader>
      
      <CardContent className="py-2">
        <div className="flex items-center gap-2 mb-1 mt-1">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Flag className="h-3 w-3 text-red-500" />
            {getReasonLabel(report.reason)}
          </Badge>
        </div>
        
        {report.details && (
          <div className="mt-2 text-sm">
            <p className="whitespace-pre-line">{report.details}</p>
          </div>
        )}
        
        {report.response && (
          <div className="mt-3 p-3 bg-muted/60 rounded-md">
            <p className="text-sm font-medium mb-1 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Phản hồi của quản trị viên:
            </p>
            <p className="text-sm text-muted-foreground">{report.response}</p>
          </div>
        )}
      </CardContent>
      
      {report.status === 'pending' && (
        <CardFooter className="pt-2 border-t border-slate-200">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full">Phản hồi báo cáo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Phản hồi báo cáo</DialogTitle>
                <DialogDescription>
                  Xem xét báo cáo này và cung cấp phản hồi của bạn.
                </DialogDescription>
              </DialogHeader>
              
              <div className="my-4">
                <div className="flex gap-3 items-center mb-2">
                  <Avatar className="h-8 w-8">
                    {typeof report.userId === 'object' && report.userId.profilePicture ? (
                      <AvatarImage src={report.userId.profilePicture.url || ""} alt={reporter} />
                    ) : null}
                    <AvatarFallback>
                      <UserCircle className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{reporter}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Flag className="h-3 w-3 text-red-500" />
                      {getReasonLabel(report.reason)}
                    </p>
                  </div>
                </div>
                
                {report.details && (
                  <div className="mb-4 p-3 bg-muted rounded-md">
                    <p className="text-sm whitespace-pre-line">{report.details}</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">
                    Hành động:
                  </label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={status === 'resolved' ? 'default' : 'outline'}
                      onClick={() => setStatus('resolved')}
                      size="sm"
                      className={status === 'resolved' ? 'gap-1' : 'gap-1'}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Chấp nhận</span>
                    </Button>
                    <Button
                      type="button"
                      variant={status === 'rejected' ? 'default' : 'outline'}
                      onClick={() => setStatus('rejected')}
                      size="sm"
                      className={status === 'rejected' ? 'gap-1' : 'gap-1'}
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Từ chối</span>
                    </Button>
                  </div>
                </div>
                
                <div className="mb-2">
                  <label className="text-sm font-medium mb-2 block">
                    Phản hồi:
                  </label>
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Nhập phản hồi của bạn cho báo cáo này..."
                    className="resize-none"
                    rows={4}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsOpen(false)} variant="outline">
                  Hủy
                </Button>
                <Button onClick={handleSubmit} type="submit" className="gap-1">
                  {status === 'resolved' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span>
                    {status === 'resolved' ? 'Chấp nhận báo cáo' : 'Từ chối báo cáo'}
                  </span>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  );
}