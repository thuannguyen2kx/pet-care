import React from "react";
import { cn } from "@/lib/utils";
import { type EventProps } from "react-big-calendar";
import { CalendarEvent} from "../types/schedule.types";
import { CalendarIcon, Clock, X } from "lucide-react";
export const EventComponent: React.FC<EventProps<CalendarEvent>> = ({ event }) => {
  const { resource } = event;

  if (resource.type === "schedule") {
    return (
      <div
        className={cn(
          "p-1 text-xs rounded-md shadow-sm border",
          resource.isWorking
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-red-100 text-red-800 border-red-200",
          resource.isDefault ? "opacity-60" : "font-semibold"
        )}
      >
        <div className="flex items-center">
          {resource.isWorking ? (
            <Clock className="w-3 h-3 mr-1" />
          ) : (
            <X className="w-3 h-3 mr-1" />
          )}
          <span className="truncate">{event.title}</span>
        </div>
        {resource.isDefault && (
          <span className="text-[10px] italic">(Mặc định)</span>
        )}
      </div>
    );
  } else {
    return (
      <div className="p-1 text-xs rounded-md shadow-sm border bg-blue-100 text-blue-800 border-blue-200">
        <div className="flex items-center">
          <CalendarIcon className="w-3 h-3 mr-1" />
          <span className="truncate">{event.title}</span>
        </div>
      </div>
    );
  }
};