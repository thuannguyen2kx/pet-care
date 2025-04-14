import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { AppointmentDetailsType } from "@/features/appointment/types/api.types";
import { useUpdateAppointmentStatus } from "@/features/appointment/hooks/mutations/update-appointment";
import { AppointmentStatus } from "@/constants";

interface AppointmentStatusActionsProps {
  appointment: AppointmentDetailsType | undefined;
  isLoading: boolean;
}

const AppointmentStatusActions: React.FC<AppointmentStatusActionsProps> = ({
  appointment,
  isLoading,
}) => {
  const [serviceNotes, setServiceNotes] = useState<string>("");
  const [actionType, setActionType] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false); 
  const updateStatusMutation = useUpdateAppointmentStatus();

  // Get status color for styling
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

  // Open dialog for status change confirmation
  const openStatusChangeDialog = (nextStatus: AppointmentStatus) => {
    setActionType(nextStatus);
    setServiceNotes(appointment?.serviceNotes || "");
    setDialogOpen(true);
  };

  // Handle status update confirmation
  const handleStatusUpdate = async () => {
    if (!appointment?._id || !actionType) return;

    try {
      await updateStatusMutation.mutateAsync({
        appointmentId: appointment._id,
        status: actionType,
        serviceNotes: serviceNotes.trim() || undefined,
      });

      setDialogOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Get status action buttons based on current status
  const getStatusActions = () => {
    if (!appointment) return null;

    if (
      appointment.status === "completed" ||
      appointment.status === "cancelled"
    ) {
      return (
        <div
          className={`text-sm p-3 rounded ${getStatusColor(
            appointment.status
          )}`}
        >
          Cuộc hẹn đã{" "}
          {appointment.status === "completed" ? "hoàn thành" : "bị hủy"}
        </div>
      );
    }

    switch (appointment.status) {
      case "pending":
        return (
          <>
            <Button
              className="w-full"
              variant="default"
              onClick={() =>
                openStatusChangeDialog(AppointmentStatus.CONFIRMED)
              }
              disabled={updateStatusMutation.isPending}
            >
              Xác nhận cuộc hẹn
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() =>
                openStatusChangeDialog(AppointmentStatus.CANCELLED)
              }
              disabled={updateStatusMutation.isPending}
            >
              Hủy cuộc hẹn
            </Button>
          </>
        );

      case "confirmed":
        return (
          <>
            <Button
              className="w-full"
              variant="default"
              onClick={() =>
                openStatusChangeDialog(AppointmentStatus.IN_PROGRESS)
              }
              disabled={updateStatusMutation.isPending}
            >
              Bắt đầu thực hiện
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() =>
                openStatusChangeDialog(AppointmentStatus.CANCELLED)
              }
              disabled={updateStatusMutation.isPending}
            >
              Hủy cuộc hẹn
            </Button>
          </>
        );

      case "in-progress":
        return (
          <>
            <Button
              className="w-full"
              variant="default"
              onClick={() =>
                openStatusChangeDialog(AppointmentStatus.COMPLETED)
              }
              disabled={updateStatusMutation.isPending}
            >
              Hoàn thành
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() =>
                openStatusChangeDialog(AppointmentStatus.CANCELLED)
              }
              disabled={updateStatusMutation.isPending}
            >
              Hủy cuộc hẹn
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  // Get action label based on the selected action type
  const getActionLabel = () => {
    switch (actionType) {
      case "confirmed":
        return "xác nhận";
      case "in-progress":
        return "bắt đầu thực hiện";
      case "completed":
        return "hoàn thành";
      case "cancelled":
        return "hủy";
      default:
        return "cập nhật trạng thái";
    }
  };

  // Determine if current action is cancel action
  const isCancelAction = actionType === "cancelled";

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-lg">Thao tác</CardTitle>
      </CardHeader>

      <CardFooter className="border-t border-slate-300 pt-4 flex-col">
        <div className="w-full space-y-2">
          <h3 className="text-sm font-medium">Trạng thái cuộc hẹn</h3>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div className="grid grid-cols-1 gap-2">{getStatusActions()}</div>
          )}
        </div>
      </CardFooter>

      {/* Status Change Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCancelAction ? (
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Xác nhận hủy cuộc hẹn
                </div>
              ) : (
                <>Xác nhận {getActionLabel()} cuộc hẹn</>
              )}
            </DialogTitle>
            <DialogDescription>
              {isCancelAction
                ? "Bạn có chắc chắn muốn hủy cuộc hẹn này? Hành động này không thể hoàn tác."
                : `Bạn sắp ${getActionLabel()} cuộc hẹn với khách hàng ${
                    appointment?.customerId?.fullName || ""
                  }.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="serviceNotes">
                Ghi chú dịch vụ {!isCancelAction && "(không bắt buộc)"}
              </Label>
              <Textarea
                id="serviceNotes"
                placeholder={
                  isCancelAction
                    ? "Vui lòng nhập lý do hủy cuộc hẹn..."
                    : "Nhập ghi chú về dịch vụ..."
                }
                value={serviceNotes}
                onChange={(e) => setServiceNotes(e.target.value)}
                rows={4}
                required={isCancelAction}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy bỏ</Button>
            </DialogClose>
            <Button
              variant={isCancelAction ? "destructive" : "default"}
              onClick={handleStatusUpdate}
              disabled={
                updateStatusMutation.isPending ||
                (isCancelAction && !serviceNotes.trim())
              }
            >
              {updateStatusMutation.isPending
                ? "Đang xử lý..."
                : isCancelAction
                ? "Xác nhận hủy"
                : `Xác nhận ${getActionLabel()}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AppointmentStatusActions;
