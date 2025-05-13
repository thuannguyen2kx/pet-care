import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import {
  AlertTriangle,
  Calendar,
  Pill,
  Stethoscope,
  FileText,
} from "lucide-react";
import { AppointmentDetailsType } from "@/features/appointment/types/api.types";
import { useUpdateAppointmentStatus } from "@/features/appointment/hooks/mutations/update-appointment";
import { useAddMedicalRecord } from "@/features/pet/hooks/mutations/add-medical-record";
import { AppointmentStatus } from "@/constants";
import { useAddVaccination } from "@/features/pet/hooks/mutations/add-vaccination";

// Schema for service completion form with pet care data
const serviceCompletionSchema = z.object({
  serviceNotes: z.string().optional(),
  condition: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  // Add vaccination fields if needed
  vaccination: z
    .object({
      name: z.string().optional(),
      date: z.string().optional(),
      expiryDate: z.string().optional(),
      certificate: z.string().optional(),
    })
    .optional(),
});

type ServiceCompletionFormValues = z.infer<typeof serviceCompletionSchema>;

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
  const [activeTab, setActiveTab] = useState<string>("general");
  const updateStatusMutation = useUpdateAppointmentStatus();
  const addMedicalRecord = useAddMedicalRecord();
  const addVaccination = useAddVaccination();

  // Initialize form for service completion
  const completionForm = useForm<ServiceCompletionFormValues>({
    resolver: zodResolver(serviceCompletionSchema),
    defaultValues: {
      serviceNotes: appointment?.serviceNotes || "",
      condition: "",
      treatment: "",
      notes: "",
      vaccination: {
        name: "",
        date: format(new Date(), "yyyy-MM-dd"),
        expiryDate: "",
        certificate: "",
      },
    },
  });

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
    if (nextStatus === AppointmentStatus.COMPLETED) {
      // Reset form with default values for completion
      completionForm.reset({
        serviceNotes: appointment?.serviceNotes || "",
        condition: "",
        treatment: "",
        notes: "",
        vaccination: {
          name: "",
          date: format(new Date(), "yyyy-MM-dd"),
          expiryDate: "",
          certificate: "",
        },
      });
    } else {
      // For other status changes, just set service notes
      setServiceNotes(appointment?.serviceNotes || "");
    }
    setDialogOpen(true);
  };

  // Handle service completion submission
  const handleCompletion = async (data: ServiceCompletionFormValues) => {
    if (!appointment?._id || !appointment?.petId?._id) return;

    try {
      // First update appointment status
      updateStatusMutation.mutate({
        appointmentId: appointment._id,
        status: AppointmentStatus.COMPLETED,
        serviceNotes: data.serviceNotes?.trim() || undefined,
      });

      // If medical condition is provided, add medical record
      if (data.condition) {
        addMedicalRecord.mutate({
          petId: appointment.petId._id,
          data: {
            condition: data.condition,
            diagnosis: format(new Date(), "yyyy-MM-dd"),
            treatment: data.treatment || undefined,
            notes: data.notes || undefined,
          },
        });
      }

      // Handle vaccination if provided (would need a separate mutation)
      if (data.vaccination?.name) {
        addVaccination.mutate({
          petId: appointment.petId._id,
          data: {
            name: data.vaccination.name,
            date: data.vaccination.date || format(new Date(), "yyyy-MM-dd"),
            expiryDate: data.vaccination.expiryDate || undefined,
            certificate: data.vaccination.certificate || undefined,
          },
        });
      }

      setDialogOpen(false);
    } catch (error) {
      console.error("Error completing service:", error);
    }
  };

  // Handle regular status update confirmation
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
  const isCompletionAction = actionType === "completed";

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
        <DialogContent className={isCompletionAction ? "sm:max-w-[600px]" : ""}>
          <DialogHeader>
            <DialogTitle>
              {isCancelAction ? (
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Xác nhận hủy cuộc hẹn
                </div>
              ) : isCompletionAction ? (
                <div className="flex items-center text-green-600">
                  <FileText className="mr-2 h-5 w-5" />
                  Hoàn thành dịch vụ và cập nhật thông tin
                </div>
              ) : (
                <>Xác nhận {getActionLabel()} cuộc hẹn</>
              )}
            </DialogTitle>
            <DialogDescription>
              {isCancelAction
                ? "Bạn có chắc chắn muốn hủy cuộc hẹn này? Hành động này không thể hoàn tác."
                : isCompletionAction
                ? `Vui lòng nhập thông tin kết quả dịch vụ cho thú cưng ${
                    appointment?.petId?.name || ""
                  }.`
                : `Bạn sắp ${getActionLabel()} cuộc hẹn với khách hàng ${
                    appointment?.customerId?.fullName || ""
                  }.`}
            </DialogDescription>
          </DialogHeader>

          {isCompletionAction ? (
            <Form {...completionForm}>
              <form
                onSubmit={completionForm.handleSubmit(handleCompletion)}
                className="space-y-4"
              >
                <Tabs
                  defaultValue="general"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="bg-orange-50 border-orange-200 border grid grid-cols-3 w-full">
                    <TabsTrigger
                      value="general"
                      className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                      Thông tin chung
                    </TabsTrigger>
                    <TabsTrigger
                      value="medical"
                      className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                      Tình trạng y tế
                    </TabsTrigger>
                    <TabsTrigger
                      value="vaccination"
                      className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                    >
                      Tiêm phòng
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="mt-4 space-y-4">
                    <FormField
                      control={completionForm.control}
                      name="serviceNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghi chú dịch vụ</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập ghi chú về dịch vụ..."
                              className="border-orange-200"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="medical" className="mt-4 space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-md border border-orange-100 bg-orange-50">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-sm">
                        Thêm thông tin y tế mới cho thú cưng{" "}
                        <strong>{appointment?.petId?.name}</strong>. Thông tin
                        này sẽ được lưu vào lịch sử y tế.
                      </div>
                    </div>

                    <FormField
                      control={completionForm.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tình trạng/Bệnh</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tình trạng hoặc bệnh (nếu có)"
                              className="border-orange-200"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={completionForm.control}
                      name="treatment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phương pháp điều trị</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập phương pháp điều trị (nếu có)"
                              className="border-orange-200"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={completionForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghi chú y tế</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập ghi chú y tế thêm (nếu có)"
                              className="border-orange-200"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="vaccination" className="mt-4 space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-md border border-orange-100 bg-orange-50">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Pill className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-sm">
                        Thêm thông tin tiêm phòng mới cho thú cưng{" "}
                        <strong>{appointment?.petId?.name}</strong>. Để trống
                        nếu không có thông tin tiêm phòng.
                      </div>
                    </div>

                    <FormField
                      control={completionForm.control}
                      name="vaccination.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên vaccine</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên vaccine"
                              className="border-orange-200"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={completionForm.control}
                        name="vaccination.date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày tiêm</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-orange-500" />
                                <Input
                                  type="date"
                                  className="border-orange-200 pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={completionForm.control}
                        name="vaccination.expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày hết hạn</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-orange-500" />
                                <Input
                                  type="date"
                                  className="border-orange-200 pl-10"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={completionForm.control}
                      name="vaccination.certificate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mã chứng nhận</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập mã chứng nhận (nếu có)"
                              className="border-orange-200"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>

                <DialogFooter className="mt-6">
                  <DialogClose asChild>
                    <Button variant="outline">Hủy bỏ</Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    disabled={
                      updateStatusMutation.isPending ||
                      addMedicalRecord.isPending
                    }
                  >
                    {updateStatusMutation.isPending ||
                    addMedicalRecord.isPending
                      ? "Đang xử lý..."
                      : "Hoàn thành dịch vụ"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
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
          )}

          {!isCompletionAction && (
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
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AppointmentStatusActions;
