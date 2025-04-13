// src/features/appointment/components/calendar/CalendarHeader.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, ListFilter } from "lucide-react";

interface CalendarHeaderProps {
  selectedEmployeeId: string;
  employeeName?: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedEmployeeId,
  employeeName
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <CardTitle>Lịch hẹn</CardTitle>
        <CardDescription>
          {selectedEmployeeId !== 'all' 
            ? `Lịch hẹn của ${employeeName || 'nhân viên'}`
            : 'Lịch hẹn của tất cả nhân viên'
          }
        </CardDescription>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link to="/admin/appointments">
            <ListFilter className="mr-2 h-4 w-4" />
            Xem danh sách
          </Link>
        </Button>
        <Button asChild>
          <Link to="/admin/appointments/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo lịch hẹn
          </Link>
        </Button>
      </div>
    </div>
  );
};

