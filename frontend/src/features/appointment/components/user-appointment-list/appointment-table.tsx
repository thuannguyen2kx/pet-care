import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Clock, MoreHorizontal } from "lucide-react";
import { UserAppointmentType } from "@/features/appointment/types/api.types"; 
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusBadge from "./status-badge";
import { formatVND } from "@/lib/helper";
import { formatDuration } from "@/features/appointment/utils/appointment-form-config";

interface AppointmentTableProps {
  appointments: UserAppointmentType[];
  onCancelAppointment: (appointmentId: string) => void;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  onCancelAppointment,
}) => {
  if (!appointments?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không có lịch hẹn nào.
      </div>
    );
  }

  return (
    <div className="rounded-md">
      <Table className="border-none">
        <TableHeader>
          <TableRow>
            <TableHead>Thú cưng</TableHead>
            <TableHead>Dịch vụ</TableHead>
            <TableHead>Ngày</TableHead>
            <TableHead>Giờ</TableHead>
            <TableHead>Nhân viên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment._id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {appointment.petId.profilePicture ? (
                    <img
                      src={appointment.petId.profilePicture.url || ""}
                      alt={appointment.petId.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                  )}
                  {appointment.petId.name}
                </div>
              </TableCell>
              <TableCell>
                <Link
                  to={`/services/${appointment.serviceId._id}`}
                  className="hover:text-primary hover:underline"
                >
                  {appointment.serviceId.name || "Dịch vụ không xác định"}
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Giá</p>
                    <p className="font-medium">
                      {formatVND(appointment.serviceId.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Thời gian</p>
                    <p className="font-medium">
                      {formatDuration(appointment.serviceId.duration)}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(appointment.scheduledDate), "dd/MM/yyyy", {
                  locale: vi,
                })}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-gray-500" />
                  {appointment.scheduledTimeSlot.start}
                </div>
              </TableCell>
              <TableCell>
                {appointment.employeeId?.fullName || "Chưa phân công"}
              </TableCell>
              <TableCell>
                <StatusBadge status={appointment.status} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Mở menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/appointments/${appointment._id}`}>
                        Xem chi tiết
                      </Link>
                    </DropdownMenuItem>
                    {(appointment.status === "pending" ||
                      appointment.status === "confirmed") && (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onCancelAppointment(appointment._id)}
                      >
                        Hủy lịch hẹn
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentTable;