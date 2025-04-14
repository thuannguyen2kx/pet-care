import React from "react";
import { cn } from "@/lib/utils";

interface TimeSlotProps {
  time: string;
  isCurrentHour?: boolean;
  children?: React.ReactNode;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ 
  time, 
  isCurrentHour = false,
  children 
}) => {
  return (
    <div className="flex min-h-14 border-t border-gray-200">
      <div className="w-16 -mt-3.5 pr-2 text-right text-xs text-gray-500">
        {time}
      </div>
      <div 
        className={cn(
          "flex-1 relative",
          isCurrentHour && "bg-blue-50"
        )}
      >
        {isCurrentHour && (
          <div className="absolute left-0 right-0 h-0.5 bg-blue-500" />
        )}
        {children}
      </div>
    </div>
  );
};