import { Badge } from "@/components/ui/badge";

type PostStatusBadgeProps = {
  status: 'pending' | 'rejected' | 'resolved',
  className?: string;
};

export function PostStatusBadge({ status, className }: PostStatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'resolved':
        return 'bg-green-500 hover:bg-green-600';
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'rejected':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'pending':
        return 'Đang xét duyệt';
      case 'rejected':
        return 'Chặn';
      case 'resolved':
        return 'Đã xét duyệt';
      default:
        return status;
    }
  };

  return (
    <Badge className={`${getStatusColor()} ${className}`}>
      {getStatusLabel()}
    </Badge>
  );
}