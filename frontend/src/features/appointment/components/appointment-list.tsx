import React, { useState } from "react";
import { Link } from "react-router-dom";
import { format, isAfter } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Filter,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetUserAppointments } from "../hooks/queries/get-user-appointments";
import { useCancelAppointment } from "../hooks/mutations/cancel-appointment";
import { UserAppointmentType } from "../types/api.types";

const AppointmentList: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(
    null
  );

  const { data, isLoading, error } = useGetUserAppointments();

  const cancelAppointmentMutation = useCancelAppointment();

  const handleCancelAppointment = () => {
    if (appointmentToCancel) {
      cancelAppointmentMutation.mutate(appointmentToCancel, {
        onSuccess: () => {
          setAppointmentToCancel(null);
        },
      });
    }
  };

  // Filter appointments by status and search term
  const filteredAppointments = data?.appointments?.filter((appointment) => {
    const matchesStatus = !statusFilter || appointment.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      appointment.petId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appointment.employeeId?.fullName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Separate upcoming and past appointments
  const now = new Date();
  const upcomingAppointments = filteredAppointments?.filter(
    (appointment) =>
      isAfter(new Date(appointment.scheduledDate), now) ||
      appointment.status === "pending" ||
      appointment.status === "confirmed" ||
      appointment.status === "in-progress"
  );

  const pastAppointments = filteredAppointments?.filter(
    (appointment) => !upcomingAppointments?.includes(appointment)
  );

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

  // Loading state
  if (isLoading)
    return <div className="flex justify-center p-8">Đang tải...</div>;

  // Error state
  if (error)
    return <div className="p-8 text-center text-red-500">Đã xảy ra lỗi</div>;

  // Render appointment list
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lịch hẹn của tôi</CardTitle>
            <CardDescription>Quản lý tất cả lịch hẹn của bạn</CardDescription>
          </div>
          <Button asChild>
            <Link to="/appointments/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Đặt lịch hẹn mới
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên thú cưng hoặc nhân viên..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>
                    {statusFilter
                      ? "Trạng thái: " + statusFilter
                      : "Tất cả trạng thái"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
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
            {renderAppointmentsTable(upcomingAppointments || [])}
          </TabsContent>

          <TabsContent value="past">
            {renderAppointmentsTable(pastAppointments || [])}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Cancel Appointment Dialog */}
      <AlertDialog
        open={!!appointmentToCancel}
        onOpenChange={(open) => !open && setAppointmentToCancel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy lịch hẹn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy lịch hẹn này không? Hành động này không
              thể hoàn tác. Lưu ý rằng bạn chỉ có thể hủy lịch hẹn ít nhất 24
              giờ trước thời gian đã đặt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelAppointment}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Hủy lịch hẹn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );

  // Helper function to render appointments table
  function renderAppointmentsTable(appointments: UserAppointmentType[]) {
    if (!appointments?.length) {
      return (
        <div className="text-center py-8 text-gray-500">
          Không có lịch hẹn nào.
        </div>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
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
                  {appointment.serviceId || "Dịch vụ không xác định"}
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
                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
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
                          onClick={() =>
                            setAppointmentToCancel(appointment._id)
                          }
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
  }
};

export default AppointmentList;