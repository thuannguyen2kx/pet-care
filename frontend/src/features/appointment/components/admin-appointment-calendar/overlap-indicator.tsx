import React from "react";
import { MoreHorizontal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OverlapIndicatorProps {
  count: number;
  totalAppointments: number;
}

export const OverlapIndicator: React.FC<OverlapIndicatorProps> = ({
  count,
  totalAppointments
}) => {
  if (count <= 0) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute top-1 right-1 flex items-center justify-center bg-white rounded-full w-5 h-5 shadow-sm z-50 cursor-help">
            <MoreHorizontal className="h-3 w-3 text-gray-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{count} cuộc hẹn trùng lịch</p>
          <p className="text-xs text-gray-500">Tổng cộng {totalAppointments} cuộc hẹn</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};