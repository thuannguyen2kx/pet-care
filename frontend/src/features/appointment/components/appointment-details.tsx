// src/components/appointments/AppointmentDetail.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  FileEdit,
  User,
  PawPrint,
  ClipboardCheck,
  XCircle,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import { useGetAppointmentById } from "../hooks/queries/get-appointment";
import { useCancelAppointment } from "../hooks/mutations/cancel-appointment";
import { useUpdateAppointmentStatus } from "../hooks/mutations/update-appointment";

const AppointmentDetail: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const [newStatus, setNewStatus] = useState<string>("");
  const [serviceNotes, setServiceNotes] = useState<string>("");
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { data, isLoading, error } = useGetAppointmentById(appointmentId || "");

  const cancelAppointmentMutation = useCancelAppointment();
  const updateStatusMutation = useUpdateAppointmentStatus();

  const handleCancelAppointment = () => {
    if (!appointmentId) return;

    cancelAppointmentMutation.mutate(appointmentId, {
      onSuccess: () => {
        setShowCancelDialog(false);
        navigate("/appointments");
      },
    });
  };

  const handleUpdateStatus = () => {
    if (!appointmentId || !newStatus) return;

    updateStatusMutation.mutate(
      {
        appointmentId,
        status: newStatus,
        serviceNotes: serviceNotes || undefined,
      },
      {
        onSuccess: () => {
          setShowStatusDialog(false);
          setNewStatus("");
          setServiceNotes("");
        },
      }
    );
  };

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

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: string }> = {
      pending: {
        label: "Chờ xử lý",
        variant: "warning",
      },
      confirmed: {
        label: "Đã xác nhận",
        variant: "success",
      },
      "in-progress": {
        label: "Đang thực hiện",
        variant: "info",
      },
      completed: {
        label: "Hoàn thành",
        variant: "default",
      },
      cancelled: {
        label: "Đã hủy",
        variant: "destructive",
      },
    };

    const { label } = statusMap[status] || {
      label: status,
      variant: "default",
    };

    return <Badge>{label}</Badge>;
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <ClipboardCheck className="h-5 w-5 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <PlayCircle className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-gray-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <ClipboardCheck className="h-5 w-5" />;
    }
  };

  // Loading state
  if (isLoading)
    return <div className="flex justify-center p-8">Đang tải...</div>;

  // Error state
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Đã xảy ra lỗi: {error.message}
      </div>
    );

  const appointment = data?.appointment;
  const service = appointment?.serviceId;
  const pet = appointment?.petId;
  const employee = appointment?.employeeId;
  const userRole = localStorage.getItem("userRole") || "customer"; // Simulated user role

  // Calculate if the appointment can be cancelled (24h before)
  const canCancel =
    appointment &&
    (appointment.status === "pending" || appointment.status === "confirmed") &&
    (userRole === "admin" ||
      new Date(appointment.scheduledDate).getTime() - new Date().getTime() >
        24 * 60 * 60 * 1000);

  // Calculate if status can be updated
  const canUpdateStatus =
    appointment &&
    userRole !== "customer" &&
    appointment.status !== "completed" &&
    appointment.status !== "cancelled";

  if (!appointment) {
    return <div className="p-8 text-center text-red-500">Không tìm thấy cuộc hẹn</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <div className="flex items-center gap-2">
          {canCancel && (
            <Button
              variant="outline"
              className="text-red-600"
              onClick={() => setShowCancelDialog(true)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Hủy lịch hẹn
            </Button>
          )}

          {canUpdateStatus && (
            <Button onClick={() => setShowStatusDialog(true)}>
              <FileEdit className="mr-2 h-4 w-4" />
              Cập nhật trạng thái
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Chi tiết lịch hẹn</CardTitle>
              <CardDescription>
                Thông tin chi tiết về lịch hẹn của bạn
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(appointment.status)}
              {getStatusBadge(appointment.status)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Service Info */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 font-medium text-lg">Thông tin dịch vụ</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Tên dịch vụ</p>
                <p className="font-medium">{service?.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Loại dịch vụ</p>
                <p className="font-medium">
                  {appointment.serviceType === "single"
                    ? "Dịch vụ đơn lẻ"
                    : "Gói dịch vụ"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Thời gian dự kiến</p>
                <p className="font-medium">{service?.duration} phút</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Giá dịch vụ</p>
                <p className="font-medium flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {appointment.totalAmount.toLocaleString()} VND
                </p>
              </div>
            </div>

            {service?.description && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm text-gray-500">Mô tả dịch vụ</p>
                  <p>{service.description}</p>
                </div>
              </>
            )}
          </div>

          {/* Appointment Info */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 font-medium text-lg">Thông tin lịch hẹn</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Ngày hẹn</p>
                  <p className="font-medium">
                    {format(
                      new Date(appointment.scheduledDate),
                      "EEEE, dd/MM/yyyy",
                      { locale: vi }
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Thời gian</p>
                  <p className="font-medium">
                    {appointment.scheduledTimeSlot.start} -{" "}
                    {appointment.scheduledTimeSlot.end}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Nhân viên</p>
                  <p className="font-medium">
                    {employee?.fullName || "Chưa phân công"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <PawPrint className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Thú cưng</p>
                  <p className="font-medium">
                    {pet?.name} ({pet?.species} - {pet?.breed})
                  </p>
                </div>
              </div>
            </div>

            {appointment.notes && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm text-gray-500">Ghi chú của bạn</p>
                  <p>{appointment.notes}</p>
                </div>
              </>
            )}

            {appointment.serviceNotes && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm text-gray-500">Ghi chú của nhân viên</p>
                  <p>{appointment.serviceNotes}</p>
                </div>
              </>
            )}

            {appointment.status === "completed" && appointment.completedAt && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm text-gray-500">Hoàn thành lúc</p>
                  <p className="font-medium">
                    {format(
                      new Date(appointment.completedAt),
                      "dd/MM/yyyy HH:mm"
                    )}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Payment Info */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-4 font-medium text-lg">Thông tin thanh toán</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                <Badge
                // variant={
                //   appointment.paymentStatus === "paid" ? "success" :
                //   appointment.paymentStatus === "refunded" ? "warning" :
                //   "default"
                // }
                >
                  {appointment.paymentStatus === "paid"
                    ? "Đã thanh toán"
                    : appointment.paymentStatus === "refunded"
                    ? "Đã hoàn tiền"
                    : "Chưa thanh toán"}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-gray-500">Tổng tiền</p>
                <p className="font-medium text-lg flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {appointment.totalAmount.toLocaleString()} VND
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái cuộc hẹn</DialogTitle>
            <DialogDescription>
              Thay đổi trạng thái cuộc hẹn và thêm ghi chú nếu cần.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Trạng thái hiện tại</p>
              <div>{getStatusBadge(appointment.status)}</div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Trạng thái mới</p>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
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
              <p className="text-sm font-medium">
                Ghi chú dịch vụ (không bắt buộc)
              </p>
              <Textarea
                placeholder="Nhập ghi chú về dịch vụ..."
                value={serviceNotes}
                onChange={(e) => setServiceNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={!newStatus || updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending
                ? "Đang cập nhật..."
                : "Cập nhật trạng thái"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Appointment Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy lịch hẹn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy lịch hẹn này không? Hành động này không
              thể hoàn tác.
              {userRole !== "admin" && (
                <p className="mt-2 font-medium">
                  Lưu ý: Bạn chỉ có thể hủy lịch hẹn ít nhất 24 giờ trước thời
                  gian đã đặt.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelAppointment}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={cancelAppointmentMutation.isPending}
            >
              {cancelAppointmentMutation.isPending
                ? "Đang hủy..."
                : "Hủy lịch hẹn"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppointmentDetail;