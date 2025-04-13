import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetUserAppointments } from "@/features/appointment/hooks/queries/get-user-appointments";
import { useCancelAppointment } from "@/features/appointment/hooks/mutations/cancel-appointment";
import { UserAppointmentType } from "@/features/appointment/types/api.types";

import AppointmentFilterBar from "./filter-bar";
import AppointmentTable from "./appointment-table";
import AppointmentListView from "./appointment-list";
import ViewSwitcher from "./view-switch";
import {
  AppointmentErrorState,
  AppointmentLoadingState,
} from "./loading-and-error-state";
import {
  filterAppointmentsByStatusAndTerm,
  separateAppointmentsByDate,
} from "@/features/appointment/utils/user-appointment-utils";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

const AppointmentList: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "list">("list");

  const { data, isLoading, error } = useGetUserAppointments();
  const cancelAppointmentMutation = useCancelAppointment();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Xác nhận huỷ lịch hẹn",
    "  Bạn có chắc chắn muốn hủy lịch hẹn này không? Hành động này không thể hoàn tác. Lưu ý rằng bạn chỉ có thể hủy lịch hẹn ít nhất 24 giờ trước thời gian đã đặt."
  );

  const handleCancelAppointment = async (appointmentId: string) => {
    const ok = await confirmDelete();
    if (!ok) return;
    cancelAppointmentMutation.mutate(appointmentId, {
      onSuccess: () => {
        toast.success("Đã hủy lịch hẹn thành công!");
      },
      onError: () => {
        toast.error("Đã xảy ra lỗi khi hủy lịch hẹn. Vui lòng thử lại.");
      },
    });
  };
  // Loading and error states
  if (isLoading) return <AppointmentLoadingState />;
  if (error) return <AppointmentErrorState />;

  // Filter appointments
  const filteredAppointments = filterAppointmentsByStatusAndTerm(
    data?.appointments || [],
    statusFilter,
    searchTerm
  );

  // Separate appointments by date
  const { upcomingAppointments, pastAppointments } =
    separateAppointmentsByDate(filteredAppointments);

  // Render the appropriate view based on viewMode
  const renderAppointmentView = (appointments: UserAppointmentType[]) => {
    if (viewMode === "table") {
      return (
        <AppointmentTable
          appointments={appointments}
          onCancelAppointment={handleCancelAppointment}
        />
      );
    } else {
      return (
        <AppointmentListView
          appointments={appointments}
          onCancelAppointment={handleCancelAppointment}
        />
      );
    }
  };

  return (
    <>
      <DeleteDialog />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lịch hẹn của tôi</CardTitle>
              <CardDescription>Quản lý tất cả lịch hẹn của bạn</CardDescription>
            </div>
            <Button asChild>
              <Link to="/services">
                <PlusCircle className="mr-2 h-4 w-4" />
                Đặt lịch hẹn mới
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="flex-1">
              <AppointmentFilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
              />
            </div>
            <div className="sm:ml-4 flex items-center"> 
              <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
            </div>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">
                Sắp tới ({upcomingAppointments?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="past">
                Đã qua ({pastAppointments?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {renderAppointmentView(upcomingAppointments)}
            </TabsContent>

            <TabsContent value="past">
              {renderAppointmentView(pastAppointments)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

export default AppointmentList;
