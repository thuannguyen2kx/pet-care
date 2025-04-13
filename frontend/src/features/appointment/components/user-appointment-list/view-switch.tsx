import React from "react";
import { List, Grid } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ViewSwitcherProps {
  currentView: "table" | "list";
  onViewChange: (view: "table" | "list") => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <TooltipProvider>
      <ToggleGroup type="single" value={currentView} onValueChange={(value) => value && onViewChange(value as "table" | "list")}>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="table" aria-label="Table view">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>
            <p>Chế độ xem bảng</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>
            <p>Chế độ xem danh sách</p>
          </TooltipContent>
        </Tooltip>
      </ToggleGroup>
    </TooltipProvider>
  );
};

export default ViewSwitcher;