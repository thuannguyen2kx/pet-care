import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { NavigateAction } from "react-big-calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDays,
  LayoutGrid,
} from "lucide-react";

interface CalendarToolbarProps {
  date: Date;
  onNavigate: (navigate: NavigateAction, date?: Date) => void;
  setViewMode?: (mode: "calendar" | "grid") => void;
  viewMode?: "calendar" | "grid";
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({ 
  date, 
  onNavigate,
  setViewMode,
  viewMode
}) => {
  const goToToday = () => onNavigate("TODAY");
  const goToPrev = () => onNavigate("PREV");
  const goToNext = () => onNavigate("NEXT");

  const currentDate = new Date(date);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const months = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  const baseYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => baseYear - 2 + i);

  const navigateToMonthYear = (month: number, year: number) => {
    const newDate = new Date(date);
    newDate.setMonth(month);
    newDate.setFullYear(year);
    onNavigate("DATE", newDate);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4 gap-4">
      <div className="flex justify-between w-full md:w-auto">
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={goToPrev}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={goToToday}>
            Hôm nay
          </Button>
          <Button size="sm" variant="outline" onClick={goToNext}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        
        {setViewMode && (
          <div className="flex md:hidden">
            <Button 
              variant={viewMode === "calendar" ? "default" : "outline"} 
              size="sm" 
              className="rounded-r-none"
              onClick={() => setViewMode("calendar")}
            >
              <CalendarDays className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "grid" ? "default" : "outline"} 
              size="sm" 
              className="rounded-l-none"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <h2 className="text-sm font-semibold hidden md:block">
        {format(date, "MMMM yyyy", { locale: vi }).charAt(0).toUpperCase() +
          format(date, "MMMM yyyy", { locale: vi }).slice(1)}
      </h2>

      <div className="flex items-center gap-2">
        <Select
          value={currentMonth.toString()}
          onValueChange={(value) =>
            navigateToMonthYear(Number.parseInt(value), currentYear)
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Tháng" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentYear.toString()}
          onValueChange={(value) =>
            navigateToMonthYear(currentMonth, Number.parseInt(value))
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Năm" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};