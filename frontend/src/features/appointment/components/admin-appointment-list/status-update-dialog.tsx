import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdminAppointmentType } from "@/features/appointment/types/api.types";
import StatusBadge from "../status-badge";

interface StatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AdminAppointmentType | null;
  onUpdateStatus: (status: string, notes: string) => void;
  isUpdating: boolean;
}

export const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({
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
    onUpdateStatus(newStatus, serviceNotes);
  };
  
  if (!appointment) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái cuộc hẹn</DialogTitle>
          <DialogDescription>
            Thay đổi trạng thái cuộc hẹn và thêm ghi chú nếu cần.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Khách hàng</p>
              <p className="font-medium">{appointment.customerId?.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Thú cưng</p>
              <p className="font-medium">{appointment.petId?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Dịch vụ</p>
              <p className="font-medium">{appointment.serviceId?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Thời gian</p>
              <p className="font-medium">
                {format(new Date(appointment.scheduledDate), "dd/MM/yyyy")} {appointment.scheduledTimeSlot.start}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Trạng thái hiện tại</p>
            <div><StatusBadge status={appointment.status} /></div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Trạng thái mới</p>
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
            <p className="text-sm font-medium">Ghi chú dịch vụ (không bắt buộc)</p>
            <Textarea
              placeholder="Nhập ghi chú về dịch vụ..."
              value={serviceNotes}
              onChange={(e) => setServiceNotes(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!newStatus || isUpdating}
          >
            {isUpdating ? "Đang cập nhật..." : "Cập nhật trạng thái"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};