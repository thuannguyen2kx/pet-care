import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

export const AppointmentsHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <CardTitle>Quản lý lịch hẹn</CardTitle>
        <CardDescription>
          Quản lý tất cả lịch hẹn trong hệ thống
        </CardDescription>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link to="/admin/appointments/calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Xem lịch
          </Link>
        </Button> 
      </div>
    </div>
  );
};