import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, HelpCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostStatusBadgeProps {
  status: string;
  showLabel?: boolean;
}

export function PostStatusBadge({ status, showLabel = true }: PostStatusBadgeProps) {
  const getStatusInfo = () => {
    switch (status) {
      case "active":
      case "resolved":
        return {
          label: "Hoạt động",
          color: "bg-green-500 hover:bg-green-600",
          icon: <CheckCircle className="h-3 w-3 mr-1" />
        };
      case "under-review":
      case "pending":
        return {
          label: "Đang xét duyệt",
          color: "bg-amber-500 hover:bg-amber-600",
          icon: <Clock className="h-3 w-3 mr-1" />
        };
      case "blocked":
      case "rejected":
        return {
          label: "Đã chặn",
          color: "bg-red-500 hover:bg-red-600",
          icon: <AlertTriangle className="h-3 w-3 mr-1" />
        };
      default:
        return {
          label: "Không xác định",
          color: "bg-gray-500 hover:bg-gray-600",
          icon: <HelpCircle className="h-3 w-3 mr-1" />
        };
    }
  };

  const { label, color, icon } = getStatusInfo();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`${color} text-white flex items-center`}>
            {icon}
            {showLabel && <span className="text-xs">{label}</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Trạng thái: {label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}