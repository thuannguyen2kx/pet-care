import React from "react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusMap: Record<string, { label: string; variant: string }> = {
    pending: {
      label: "Chờ xử lý",
      variant: "warning",
    },
    confirmed: {
      label: "Đã xác nhận",
      variant: "success",
    },
    "in-progress": {
      label: "Đang thực hiện",
      variant: "info",
    },
    completed: {
      label: "Hoàn thành",
      variant: "default",
    },
    cancelled: {
      label: "Đã hủy",
      variant: "destructive",
    },
  };

  const { label, variant } = statusMap[status] || {
    label: status,
    variant: "default",
  };

  // Map variant to tailwind classes
  const variantClasses = {
    default: "bg-gray-200 text-gray-800",
    warning: "bg-yellow-100 text-yellow-800",
    success: "bg-green-100 text-green-800",
    info: "bg-blue-100 text-blue-800",
    destructive: "bg-red-100 text-red-800"
  };

  return (
    <Badge className={variantClasses[variant as keyof typeof variantClasses]}>
      {label}
    </Badge>
  );
};

export default StatusBadge;