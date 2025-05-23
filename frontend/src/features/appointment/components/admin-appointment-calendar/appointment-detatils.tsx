import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  User,
  PawPrint,
  Clock,
  Calendar as CalendarIcon,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "./status-indicator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdminAppointmentType } from "@/features/appointment/types/api.types";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AppointmentDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AdminAppointmentType | null;
  onUpdateStatus: (
    appointmentId: string,
    status: string,
    notes: string
  ) => void;
  isUpdating: boolean;
  sameTimeSlotCount?: number;
}

export const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  open,
  onOpenChange,
  appointment,
  onUpdateStatus,
  isUpdating,
  sameTimeSlotCount = 0,
}) => {
  const [newStatus, setNewStatus] = useState<string>("");
  const [serviceNotes, setServiceNotes] = useState<string>("");

  useEffect(() => {
    if (appointment) {
      setNewStatus("");
      setServiceNotes(appointment.serviceNotes || "");
    } else {
      setNewStatus("");
      setServiceNotes("");
    }
  }, [appointment]);

  if (!appointment) return null;

  // Get available status transitions
  const getAvailableStatusTransitions = (
    currentStatus: string
  ): { value: string; label: string }[] => {
    const validStatusTransitions: Record<
      string,
      { value: string; label: string }[]
    > = {
      pending: [
        { value: "confirmed", label: "Xác nhận" },
        { value: "cancelled", label: "Hủy" },
      ],
      confirmed: [
        { value: "in-progress", label: "Bắt đầu thực hiện" },
        { value: "cancelled", label: "Hủy" },
      ],
      "in-progress": [
        { value: "completed", label: "Hoàn thành" },
        { value: "cancelled", label: "Hủy" },
      ],
      completed: [],
      cancelled: [],
    };

    return validStatusTransitions[currentStatus] || [];
  };

  const handleSubmit = () => {
    if (appointment && newStatus) {
      onUpdateStatus(appointment._id, newStatus, serviceNotes);
    }
  };

  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: "Chờ xử lý",
      confirmed: "Đã xác nhận",
      "in-progress": "Đang thực hiện",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };

    return statusMap[status] || status;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "failed":
        return "Thanh toán thất bại";
      case "refunded":
        return "Đã hoàn tiền";
      default:
        return "Không xác định";
    }
  };

  // Format appointment date
  const formatAppointmentDate = () => {
    try {
      return format(new Date(appointment.scheduledDate), "EEEE, dd/MM/yyyy", {
        locale: vi,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return appointment.scheduledDate;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg py-4 px-6 overflow-y-auto">
        <SheetHeader className="space-y-2 pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">Chi tiết cuộc hẹn</SheetTitle>
          </div>
          <SheetDescription>Xem và quản lý thông tin cuộc hẹn</SheetDescription>
        </SheetHeader>

        <div className="py-4 space-y-6">
          {/* Multiple Appointments Warning */}
          {sameTimeSlotCount > 0 && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">
                Thông tin khung giờ
              </AlertTitle>
              <AlertDescription className="text-blue-700">
                Có {sameTimeSlotCount} cuộc hẹn khác trong cùng khung giờ này.
              </AlertDescription>
            </Alert>
          )}

          {/* Service and Date Info */}
          <div>
            <h3 className="text-lg font-medium">
              {appointment.serviceId?.name}
            </h3>
            <div className="flex items-center mt-2 text-gray-500">
              <div className="flex items-center mr-3">
                <StatusIndicator status={appointment.status} />
                <span
                  className={`text-sm ml-1.5 px-2 py-0.5 rounded ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {getStatusLabel(appointment.status)}
                </span>
              </div>
              <Badge
                variant="outline"
                className={getPaymentStatusColor(appointment?.paymentStatus)}
              >
                <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                {getPaymentStatusLabel(appointment?.paymentStatus)}
              </Badge>
            </div>
          </div>

          {/* Date and Time */}
          <div className="flex items-start space-x-3">
            <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium">{formatAppointmentDate()}</div>
              <div className="text-gray-500">
                {appointment.scheduledTimeSlot.start} -{" "}
                {appointment.scheduledTimeSlot.end}
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium">
                {appointment.customerId?.fullName}
              </div>
              <div className="text-gray-500">
                {appointment.customerId?.email} •{" "}
                {appointment.customerId?.phoneNumber}
              </div>
            </div>
          </div>

          {/* Pet Info */}
          <div className="flex items-start space-x-3">
            <PawPrint className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <Link to={`/manager/pets/${appointment.petId?._id}`} className="font-medium hover:underline hover:text-primary">{appointment.petId?.name}</Link>
              <div className="text-gray-500">
                {appointment.petId?.species} • {appointment.petId?.breed}
              </div>
            </div>
          </div>

          {/* Service Duration */}
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium">Thời gian dịch vụ</div>
              <div className="text-gray-500">
                {appointment.serviceId?.duration || 60} phút •{" "}
                {appointment.serviceId?.price?.toLocaleString()} VNĐ
              </div>
            </div>
          </div>

          {/* Service Notes */}
          {appointment.serviceNotes && (
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-1">Ghi chú:</h4>
              <p className="text-sm text-gray-600">
                {appointment.serviceNotes}
              </p>
            </div>
          )}

          {/* Status Update */}
          {appointment.status !== "completed" &&
            appointment.status !== "cancelled" && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h4 className="font-medium">Cập nhật trạng thái</h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trạng thái mới</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn trạng thái mới" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableStatusTransitions(appointment.status).map(
                        (status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Ghi chú dịch vụ (không bắt buộc)
                  </label>
                  <Textarea
                    placeholder="Nhập ghi chú về dịch vụ..."
                    value={serviceNotes}
                    onChange={(e) => setServiceNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            )}
        </div>

        <SheetFooter className="flex-col sm:flex-row gap-2 pt-4 border-t border-slate-300">
          <Button
            variant="outline"
            asChild
            className="sm:ml-auto border-primary text-primary"
          >
            <Link to={`/manager/appointments/${appointment._id}`}>
              Xem chi tiết đầy đủ
            </Link>
          </Button>

          {appointment.status !== "completed" &&
            appointment.status !== "cancelled" && (
              <Button
                onClick={handleSubmit}
                disabled={!newStatus || isUpdating}
              >
                {isUpdating ? "Đang cập nhật..." : "Cập nhật trạng thái"}
              </Button>
            )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
