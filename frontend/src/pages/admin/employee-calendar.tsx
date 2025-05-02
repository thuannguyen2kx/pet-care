import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { format, addDays, subDays, startOfMonth, endOfMonth } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  AlertCircle,
  Calendar as CalendarIcon,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { useGetEmployee } from "@/features/employee/hooks/queries/get-employee";
import { useGetEmployeeSchedule } from "@/features/employee/hooks/queries/get-employee-schedule";
import { CalendarView } from "@/features/appointment/components/admin-appointment-calendar/calendar-view";
import { AdminAppointmentType } from "@/features/appointment/types/api.types";
import { AppointmentDetails } from "@/features/appointment/components/admin-appointment-calendar/appointment-detatils";
import { useUpdateAppointmentStatus } from "@/features/appointment/hooks/mutations/update-appointment";

type DateRange = {
  from: Date | undefined;
  to?: Date;
};

const EmployeeCalendarPage: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: addDays(new Date(), 7),
  });
  const [selectedView, setSelectedView] = useState<"week" | "day" | "month">(
    "week"
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<AdminAppointmentType | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);

  // Fetch employee data
  const { data: employeeData, isLoading: isEmployeeLoading } = useGetEmployee(
    employeeId || ""
  );
  const updateStatusMutation = useUpdateAppointmentStatus();

  // Fetch schedule data
  const {
    data: scheduleData,
    isLoading: isScheduleLoading,
    error: scheduleError,
    refetch: refetchSchedule,
  } = useGetEmployeeSchedule(employeeId || "", {
    startDate: dateRange?.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : undefined,
    endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  });
  const formattedAppointments = useMemo(() => {
    if (!scheduleData?.appointments) return [];

    // Filter appointments by search term
    const filteredAppointments = scheduleData.appointments.filter(
      (appointment) => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        const customerName =
          appointment.customerId?.fullName?.toLowerCase() || "";
        const customerEmail =
          appointment.customerId?.email?.toLowerCase() || "";
        const petName = appointment.petId?.name?.toLowerCase() || "";
        const serviceName = appointment.serviceId?.name?.toLowerCase() || "";

        return (
          customerName.includes(searchLower) ||
          customerEmail.includes(searchLower) ||
          petName.includes(searchLower) ||
          serviceName.includes(searchLower)
        );
      }
    );

    return filteredAppointments;
  }, [scheduleData?.appointments, searchTerm]);

  // Handle appointment click
  const handleAppointmentClick = (appointment: AdminAppointmentType) => {
    const originalAppointment = scheduleData?.appointments?.find(
      (apt) => apt._id === appointment._id
    );

    if (originalAppointment) {
      setSelectedAppointment(originalAppointment);
      setShowAppointmentDetails(true);
    }
  };

  // Handle status update
  const handleUpdateStatus = (
    appointmentId: string,
    status: string,
    notes: string
  ) => {
    updateStatusMutation.mutate(
      {
        appointmentId,
        status,
        serviceNotes: notes || undefined,
      },
      {
        onSuccess: () => {
          setShowAppointmentDetails(false);
          setSelectedAppointment(null);
          refetchSchedule();
        },
      }
    );
  };

  // Handle date change
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    updateDateRange(date, selectedView);
  };

  // Handle date click from month view
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedView("day");
    updateDateRange(date, "day");
  };

  // Update date range based on selected date and view
  const updateDateRange = (date: Date, view: "day" | "week" | "month") => {
    if (view === "day") {
      setDateRange({
        from: date,
        to: date,
      });
    } else if (view === "week") {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay() + 1);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      setDateRange({
        from: startOfWeek,
        to: endOfWeek,
      });
    } else if (view === "month") {
      const firstDay = startOfMonth(date);
      const lastDay = endOfMonth(date);

      setDateRange({
        from: firstDay,
        to: lastDay,
      });
    }
  };

  // Handle view type change
  const handleViewTypeChange = (viewType: "day" | "week" | "month") => {
    setSelectedView(viewType);
    updateDateRange(selectedDate, viewType);
  };

  // Get work schedule data
  const workDays = useMemo(() => {
    if (!scheduleData?.workDays)
      return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    return scheduleData.workDays.map(
      (day) => day[0].toUpperCase() + day.slice(1).toLowerCase()
    );
  }, [scheduleData]);

  const workHours = useMemo(() => {
    if (!scheduleData?.workHours) return { start: "09:00", end: "17:00" };
    return {
      start: scheduleData.workHours.start,
      end: scheduleData.workHours.end,
    };
  }, [scheduleData]);

  // Loading states
  if (isEmployeeLoading || isScheduleLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Đang tải lịch làm việc...
      </div>
    );
  }

  // Error state
  if (scheduleError) {
    return (
      <div className="p-8 text-center text-red-500">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <p>Đã xảy ra lỗi khi tải lịch làm việc</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/admin/employees">Quay lại danh sách nhân viên</Link>
        </Button>
      </div>
    );
  }

  const employee = employeeData?.employee;

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to={`/admin/employees/${employeeId}`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                  </Link>
                </Button>
                <CardTitle>Lịch làm việc: {employee?.fullName}</CardTitle>
              </div>
            </div>
            <CardDescription className="ml-4">
              Quản lý lịch hẹn và thời gian làm việc của nhân viên
            </CardDescription>
          </CardHeader>

          <CardContent className="py-4 border-t border-slate-200">
            <div className="flex flex-col gap-4 md:flex-row mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên khách hàng, thú cưng, dịch vụ..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Popover>
                  <PopoverTrigger asChild className="border-gray-200">
                    <Button
                      variant="outline"
                      className="w-[240px] justify-start"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange?.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                            {format(dateRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        "Chọn khoảng thời gian"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                <Select
                  value={selectedView}
                  onValueChange={(value) =>
                    handleViewTypeChange(value as "day" | "week" | "month")
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Hiển thị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Theo ngày</SelectItem>
                    <SelectItem value="week">Theo tuần</SelectItem>
                    <SelectItem value="month">Theo tháng</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="h-[calc(100vh-320px)] min-h-[600px]">
              <CalendarView
                appointments={formattedAppointments}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                onDateClick={handleDateClick}
                viewType={selectedView}
                onViewTypeChange={handleViewTypeChange}
                workingHoursStart={workHours.start}
                workingHoursEnd={workHours.end}
                workDays={workDays}
                onAppointmentClick={handleAppointmentClick}
              />
             
            </div>
          </CardContent>

          <CardFooter className="border-t border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between w-full items-start sm:items-center gap-2">
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <span className="text-sm">Đã xác nhận</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Chờ xử lý</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Đang thực hiện</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-sm">Hoàn thành</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Đã hủy</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>
                  Giờ làm việc: {workHours.start} - {workHours.end}
                </span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Appointment Detail Dialog */}
      <AppointmentDetails
        open={showAppointmentDetails}
        onOpenChange={setShowAppointmentDetails}
        appointment={selectedAppointment}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={updateStatusMutation.isPending}
      />
    </>
  );
};

export default EmployeeCalendarPage;
