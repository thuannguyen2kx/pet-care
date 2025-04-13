import React from "react";

interface StatusIndicatorProps {
  status: string;
  size?: "sm" | "md" | "lg";
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = "md",
}) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "completed":
        return "bg-gray-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-purple-500";
    }
  };

  const sizeClass = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <div
      className={`${getStatusColor(status)} ${sizeClass[size]} rounded-full`}
      aria-label={`Status: ${status}`}
    />
  );
};
