import React from 'react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Calendar } from 'lucide-react';

interface AppointmentOverlapBadgeProps {
  count: number;
  className?: string;
}

export const AppointmentOverlapBadge: React.FC<AppointmentOverlapBadgeProps> = ({
  count,
  className = ''
}) => {
  if (count <= 0) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center justify-center bg-blue-100 text-blue-800 
            border border-blue-300 rounded-md px-1.5 py-0.5 text-xs font-medium ${className}`}>
            <Calendar className="h-3 w-3 mr-1" />
            {count}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{count} cuộc hẹn trong cùng khung giờ</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};