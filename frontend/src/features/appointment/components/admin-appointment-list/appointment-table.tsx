import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PawPrint } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminAppointmentType } from "@/features/appointment/types/api.types";
import StatusBadge from "../status-badge";

interface AppointmentsTableProps {
  appointments: AdminAppointmentType[];
  onUpdateStatus: (appointment: AdminAppointmentType) => void;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  onUpdateStatus,
}) => {
  if (!appointments?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không có lịch hẹn nào.
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-200">
            <TableHead>Khách hàng</TableHead>
            <TableHead>Thú cưng</TableHead>
            <TableHead>Dịch vụ</TableHead>
            <TableHead>Ngày</TableHead>
            <TableHead>Giờ</TableHead>
            <TableHead>Nhân viên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thanh toán</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment._id} className="border-slate-100">
              <TableCell>
                <div className="font-medium">{appointment.customerId?.fullName}</div>
                <div className="text-sm text-gray-500">{appointment.customerId?.email}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {appointment.petId?.profilePicture ? (
                    <img
                      src={appointment.petId.profilePicture.url || ""}
                      alt={appointment.petId.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <PawPrint className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-medium">{appointment.petId?.name}</div>
                    <div className="text-xs text-gray-500">
                      {appointment.petId?.species} - {appointment.petId?.breed}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>{appointment.serviceId?.name}</div>
                <div className="text-sm text-gray-500">
                  {appointment.serviceType === "single" ? "Dịch vụ đơn lẻ" : "Gói dịch vụ"}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(appointment.scheduledDate), "dd/MM/yyyy", { locale: vi })}
              </TableCell>
              <TableCell>
                {appointment.scheduledTimeSlot.start} - {appointment.scheduledTimeSlot.end}
              </TableCell>
              <TableCell>
                {appointment.employeeId?.fullName || (
                  <Badge variant="outline">Chưa phân công</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <StatusBadge status={appointment.status} />
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="default">
                  {appointment.paymentStatus === "paid" ? "Đã thanh toán" :
                   appointment.paymentStatus === "refunded" ? "Đã hoàn tiền" :
                   "Chưa thanh toán"}
                </Badge>
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
                      <Link to={`/admin/appointments/${appointment._id}`}>
                        Xem chi tiết
                      </Link>
                    </DropdownMenuItem>
                    {(appointment.status !== "completed" && appointment.status !== "cancelled") && (
                      <DropdownMenuItem onClick={() => onUpdateStatus(appointment)}>
                        Cập nhật trạng thái
                      </DropdownMenuItem>
                    )}
                    {!appointment.employeeId && (
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/appointments/${appointment._id}/assign`}>
                          Phân công nhân viên
                        </Link>
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