import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { X, User, PawPrint, Clock, Calendar as CalendarIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
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

interface AppointmentDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AdminAppointmentType | null;
  onUpdateStatus: (appointmentId: string, status: string, notes: string) => void;
  isUpdating: boolean;
}

export const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  open,
  onOpenChange,
  appointment,
  onUpdateStatus,
  isUpdating
}) => {
  const [newStatus, setNewStatus] = useState<string>("");
  const [serviceNotes, setServiceNotes] = useState<string>("");
  
  useEffect(() => {
    if (appointment) {
      setServiceNotes(appointment.serviceNotes || "");
    } else {
      setNewStatus("");
      setServiceNotes("");
    }
  }, [appointment]);
  
  if (!appointment) return null;
  
  // Get available status transitions
  const getAvailableStatusTransitions = (currentStatus: string): { value: string, label: string }[] => {
    const validStatusTransitions: Record<string, { value: string, label: string }[]> = {
      "pending": [
        { value: "confirmed", label: "Xác nhận" },
        { value: "cancelled", label: "Hủy" }
      ],
      "confirmed": [
        { value: "in-progress", label: "Bắt đầu thực hiện" },
        { value: "cancelled", label: "Hủy" }
      ],
      "in-progress": [
        { value: "completed", label: "Hoàn thành" },
        { value: "cancelled", label: "Hủy" }
      ],
      "completed": [],
      "cancelled": []
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
      "pending": "Chờ xử lý",
      "confirmed": "Đã xác nhận",
      "in-progress": "Đang thực hiện",
      "completed": "Hoàn thành",
      "cancelled": "Đã hủy"
    };
    
    return statusMap[status] || status;
  };
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };
  
  const getPaymentStatusLabel = (status: string): string => {
    return status === "paid" ? "Đã thanh toán" :
           status === "refunded" ? "Đã hoàn tiền" :
           "Chưa thanh toán";
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="space-y-2 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">Chi tiết cuộc hẹn</SheetTitle>
            <SheetClose className="rounded-full p-2 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </SheetClose>
          </div>
          <SheetDescription>
            Xem và quản lý thông tin cuộc hẹn
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4 space-y-6">
          {/* Service and Date Info */}
          <div>
            <h3 className="text-lg font-medium">{appointment.serviceId?.name}</h3>
            <div className="flex items-center mt-2 text-gray-500">
              <div className="flex items-center mr-3">
                <StatusIndicator status={appointment.status} />
                <span className={`text-sm ml-1.5 px-2 py-0.5 rounded ${getStatusColor(appointment.status)}`}>
                  {getStatusLabel(appointment.status)}
                </span>
              </div>
              <Badge variant="outline">
                {getPaymentStatusLabel(appointment.paymentStatus)}
              </Badge>
            </div>
          </div>
          
          {/* Date and Time */}
          <div className="flex items-start space-x-3">
            <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium">
                {format(new Date(appointment.scheduledDate), "EEEE, dd/MM/yyyy", { locale: vi })}
              </div>
              <div className="text-gray-500">
                {appointment.scheduledTimeSlot.start} - {appointment.scheduledTimeSlot.end}
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
                {appointment.customerId?.email} • {appointment.customerId?.phoneNumber}
              </div>
            </div>
          </div>
          
          {/* Pet Info */}
          <div className="flex items-start space-x-3">
            <PawPrint className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium">
                {appointment.petId?.name}
              </div>
              <div className="text-gray-500">
                {appointment.petId?.species} • {appointment.petId?.breed} 
              </div>
            </div>
          </div>
          
          {/* Service Duration */}
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <div className="font-medium">
                Thời gian dịch vụ
              </div>
              <div className="text-gray-500">
                {appointment.serviceId?.duration || 60} phút • {appointment.serviceId?.price?.toLocaleString()} VNĐ
              </div>
            </div>
          </div>
          
          {/* Service Notes */}
          {appointment.serviceNotes && (
            <div className="bg-gray-50 p-3 rounded-md">
              <h4 className="text-sm font-medium mb-1">Ghi chú:</h4>
              <p className="text-sm text-gray-600">{appointment.serviceNotes}</p>
            </div>
          )}
          
          {/* Status Update */}
          {appointment.status !== "completed" && appointment.status !== "cancelled" && (
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">Cập nhật trạng thái</h4>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Trạng thái mới</label>
                <Select 
                  value={newStatus} 
                  onValueChange={setNewStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái mới" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableStatusTransitions(appointment.status).map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Ghi chú dịch vụ (không bắt buộc)</label>
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
        
        <SheetFooter className="flex-col sm:flex-row gap-2 pt-2 border-t">
          <Button
            variant="outline"
            asChild
            className="sm:ml-auto"
          >
            <Link to={`/admin/appointments/${appointment._id}`}>
              Xem chi tiết đầy đủ
            </Link>
          </Button>
          
          {appointment.status !== "completed" && appointment.status !== "cancelled" && (
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