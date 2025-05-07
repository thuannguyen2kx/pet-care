import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Clock,
  FileEdit,
  User,
  PawPrint,
  XCircle,
  CreditCard,
  Scissors,
  UserCheck,
  CheckCircle,
  FileText,
  CalendarClock,
} from "lucide-react";
import { useGetAppointmentById } from "../hooks/queries/get-appointment";
import { useCancelAppointment } from "../hooks/mutations/cancel-appointment";
import { useUpdateAppointmentStatus } from "../hooks/mutations/update-appointment";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusIndicator } from "./admin-appointment-calendar/status-indicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/context/auth-provider";
import { Roles } from "@/constants";
import PaymentManagement from "@/features/payment/components/payment-management";

const AppointmentDetail: React.FC = () => {
  const { user } = useAuthContext();
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
  const formatDate = (dateString?: string) => {
    try {
      if (!dateString) return "N/A";
      return format(new Date(dateString), "EEEE, dd/MM/yyyy", { locale: vi });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString || "N/A";
    }
  };

  // Get status label
  const getStatusLabel = (status?: string) => {
    if (!status) return "Không xác định";

    const statusMap: Record<string, string> = {
      pending: "Chờ xử lý",
      confirmed: "Đã xác nhận",
      "in-progress": "Đang thực hiện",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };

    return statusMap[status] || status;
  };

  // Get payment status label
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

  // Get status color for badge
  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-purple-100 text-purple-800 border-purple-200";
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

  // Calculate if the appointment can be cancelled (24h before)
  const canCancel =
    appointment &&
    (appointment.status === "pending" || appointment.status === "confirmed") &&
    (user?.role === Roles.ADMIN ||
      new Date(appointment.scheduledDate).getTime() - new Date().getTime() >
        24 * 60 * 60 * 1000);

  // Calculate if status can be updated
  const canUpdateStatus =
    appointment &&
    user?.role !== Roles.CUSTOMER &&
    appointment.status !== "completed" &&
    appointment.status !== "cancelled";

  if (!appointment) {
    return (
      <div className="p-8 text-center text-red-500">
        Không tìm thấy cuộc hẹn
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col-reverse md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)}>
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

          <div className="flex-1">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {isLoading ? (
                        <Skeleton className="h-8 w-64" />
                      ) : (
                        appointment?.serviceId.name || "Chi tiết lịch hẹn"
                      )}
                    </CardTitle>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-24" />
                    </>
                  ) : (
                    <>
                      <Badge
                        variant="outline"
                        className={getStatusColor(appointment?.status)}
                      >
                        <StatusIndicator
                          status={appointment?.status || ""}
                          size="sm"
                        />
                        {getStatusLabel(appointment?.status)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getPaymentStatusColor(
                          appointment?.paymentStatus
                        )}
                      >
                        <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                        {getPaymentStatusLabel(appointment?.paymentStatus)}
                      </Badge>
                    </>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date and Time */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium flex items-center text-gray-500 mb-1">
                        <CalendarClock className="h-4 w-4 mr-1.5" />
                        Thời gian
                      </h3>
                      {isLoading ? (
                        <Skeleton className="h-6 w-full" />
                      ) : (
                        <div className="font-medium">
                          {formatDate(appointment?.scheduledDate)}
                        </div>
                      )}
                      {isLoading ? (
                        <Skeleton className="h-5 w-32 mt-1" />
                      ) : (
                        <div className="text-sm text-gray-500">
                          {appointment?.scheduledTimeSlot.start} -{" "}
                          {appointment?.scheduledTimeSlot.end}
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Service Info */}
                    <div>
                      <h3 className="text-sm font-medium flex items-center text-gray-500 mb-1">
                        <Scissors className="h-4 w-4 mr-1.5" />
                        Dịch vụ
                      </h3>
                      {isLoading ? (
                        <>
                          <Skeleton className="h-6 w-full" />
                          <Skeleton className="h-5 w-32 mt-1" />
                        </>
                      ) : (
                        <>
                          <div className="font-medium">
                            {appointment?.serviceId?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            <Clock className="h-3.5 w-3.5 inline mr-1" />
                            {appointment?.serviceId?.duration || 0} phút
                          </div>
                          <div className="text-sm text-gray-500 mt-0.5">
                            <CreditCard className="h-3.5 w-3.5 inline mr-1" />
                            {appointment?.serviceId?.price?.toLocaleString() ||
                              0}{" "}
                            VNĐ
                          </div>
                        </>
                      )}
                    </div>

                    <Separator />

                    {/* Employee Info */}
                    <div>
                      <h3 className="text-sm font-medium flex items-center text-gray-500 mb-1">
                        <UserCheck className="h-4 w-4 mr-1.5" />
                        Nhân viên phụ trách
                      </h3>
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-6 w-40" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={
                                appointment?.employeeId?.profilePicture?.url ||
                                ""
                              }
                              alt={
                                appointment?.employeeId?.fullName || "Employee"
                              }
                            />
                            <AvatarFallback>
                              {appointment?.employeeId?.fullName?.charAt(0) ||
                                "E"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {appointment?.employeeId?.fullName ||
                                "Chưa phân công"}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer and Pet Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium flex items-center text-gray-500 mb-1">
                        <User className="h-4 w-4 mr-1.5" />
                        Khách hàng
                      </h3>
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={
                                appointment?.customerId?.profilePicture?.url ||
                                ""
                              }
                              alt={
                                appointment?.customerId?.fullName || "Customer"
                              }
                            />
                            <AvatarFallback>
                              {appointment?.customerId?.fullName?.charAt(0) ||
                                "C"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {appointment?.customerId?.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment?.customerId?.email} •{" "}
                              {appointment?.customerId?.phoneNumber}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium flex items-center text-gray-500 mb-1">
                        <PawPrint className="h-4 w-4 mr-1.5" />
                        Thú cưng
                      </h3>
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={
                                appointment?.petId?.profilePicture?.url || ""
                              }
                              alt={appointment?.petId?.name || "Pet"}
                            />
                            <AvatarFallback>
                              {appointment?.petId?.name?.charAt(0) || "P"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {appointment?.petId?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment?.petId?.species} •{" "}
                              {appointment?.petId?.breed}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Status and Payment */}
                    <div>
                      <h3 className="text-sm font-medium flex items-center text-gray-500 mb-1">
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        Thanh toán
                      </h3>
                      {isLoading ? (
                        <>
                          <Skeleton className="h-6 w-full" />
                          <Skeleton className="h-4 w-32 mt-1" />
                        </>
                      ) : (
                        <>
                          <div className="font-medium">
                            {appointment?.totalAmount?.toLocaleString() || 0}{" "}
                            VNĐ
                          </div>
                          <div className="text-sm text-gray-500">
                            {getPaymentStatusLabel(appointment?.paymentStatus)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-6 space-y-4">
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium flex items-center text-gray-500 mb-2">
                      <FileText className="h-4 w-4 mr-1.5" />
                      Ghi chú
                    </h3>
                    {isLoading ? (
                      <>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3 mt-2" />
                      </>
                    ) : (
                      <div className="text-sm">
                        {appointment?.notes || "Không có ghi chú"}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium flex items-center text-gray-500 mb-2">
                      <FileText className="h-4 w-4 mr-1.5" />
                      Ghi chú dịch vụ
                    </h3>
                    {isLoading ? (
                      <>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3 mt-2" />
                      </>
                    ) : (
                      <div className="text-sm">
                        {appointment?.serviceNotes ||
                          "Không có ghi chú dịch vụ"}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chi tiết dịch vụ</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">
                      {appointment?.serviceId?.description ||
                        "Không có mô tả chi tiết dịch vụ."}
                    </p>

                    {appointment?.serviceId?.images &&
                      appointment.serviceId.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {appointment.serviceId.images
                            .filter((img) => img.url)
                            .map((image, index) => (
                              <div
                                key={index}
                                className="rounded-md overflow-hidden"
                              >
                                <img
                                  src={image.url || ""}
                                  alt={`Service ${index + 1}`}
                                  className="h-24 w-full object-cover"
                                />
                              </div>
                            ))}
                        </div>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

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
          <AlertDialog
            open={showCancelDialog}
            onOpenChange={setShowCancelDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận hủy lịch hẹn</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn hủy lịch hẹn này không? Hành động này
                  không thể hoàn tác.
                  {user?.role !== Roles.ADMIN && (
                    <p className="mt-2 font-medium">
                      Lưu ý: Bạn chỉ có thể hủy lịch hẹn ít nhất 24 giờ trước
                      thời gian đã đặt.
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
        <div className="w-full md:w-80">
          <PaymentManagement appointment={appointment} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;
