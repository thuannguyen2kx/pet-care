import { useState, useMemo } from "react";
import { format, addDays, subDays, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useGetAllAppointments } from "@/features/appointment/hooks/queries/get-appointments";
import { useGetEmployees } from "@/features/employee/hooks/queries/get-employees";
import { useUpdateAppointmentStatus } from "@/features/appointment/hooks/mutations/update-appointment";
import { AdminAppointmentType } from "@/features/appointment/types/api.types";
import { AppointmentDetails } from "./appointment-detatils";
import { CalendarView } from "./calendar-view";
import { CalendarFilters } from "./calendar-filter";
import { CalendarHeader } from "./calendar-header";

type DateRange = {
  from: Date | undefined;
  to?: Date;
};

const AdminAppointmentsCalendar = () => {
  // State for filters and views
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all");
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">("week");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: addDays(new Date(), 7),
  });
  
  // For appointment details
  const [selectedAppointment, setSelectedAppointment] = useState<AdminAppointmentType | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  
  // Define working hours and days
  const workHours = {
    start: "08:00",
    end: "18:00"
  };
  
  const workDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Fetch data
  const { 
    data: appointmentsData, 
    isLoading: isAppointmentsLoading,
    refetch: refetchAppointments
  } = useGetAllAppointments({
    status: statusFilter || undefined,
    startDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    endDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    employeeId: selectedEmployeeId !== "all" ? selectedEmployeeId : undefined,
  });
  
  const { 
    data: employeesData, 
    isLoading: isEmployeesLoading 
  } = useGetEmployees();
  
  const updateStatusMutation = useUpdateAppointmentStatus();
  
  // Format appointments for the calendar
  const formattedAppointments = useMemo(() => {
    if (!appointmentsData?.appointments) return [];
    
    // Filter appointments by search term
    const filteredAppointments = appointmentsData.appointments.filter((appointment) => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      const customerName = appointment.customerId?.fullName?.toLowerCase() || "";
      const customerEmail = appointment.customerId?.email?.toLowerCase() || "";
      const petName = appointment.petId?.name?.toLowerCase() || "";
      const serviceName = appointment.serviceId?.name?.toLowerCase() || "";
      
      return (
        customerName.includes(searchLower) ||
        customerEmail.includes(searchLower) ||
        petName.includes(searchLower) ||
        serviceName.includes(searchLower)
      );
    });
    
    return filteredAppointments;
  }, [appointmentsData?.appointments, searchTerm]);
  
  // Handle date range change from calendar
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    updateDateRange(date, calendarView);
  };
  
  // Update date range based on selected date and view
  const updateDateRange = (date: Date, view: "day" | "week" | "month") => {
    if (view === "day") {
      setDateRange({
        from: date,
        to: date
      });
    } else if (view === "week") {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Start from Monday
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Sunday
      
      setDateRange({
        from: startOfWeek,
        to: endOfWeek
      });
    } else if (view === "month") {
      const firstDay = startOfMonth(date);
      const lastDay = endOfMonth(date);
      
      setDateRange({
        from: firstDay,
        to: lastDay
      });
    }
  };
  
  // Handle day click from month view
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setCalendarView("day"); // Switch to day view
    updateDateRange(date, "day"); // Update date range for the selected day
  };
  
  // Handle appointment click
  const handleAppointmentClick = (appointment: AdminAppointmentType) => {
    const originalAppointment = appointmentsData?.appointments?.find(
      (apt) => apt._id === appointment._id
    );
    
    if (originalAppointment) {
      setSelectedAppointment(originalAppointment);
      setShowAppointmentDetails(true);
    }
  };
  
  // Handle view type change
  const handleViewTypeChange = (viewType: "day" | "week" | "month") => {
    setCalendarView(viewType);
    updateDateRange(selectedDate, viewType);
  };
  
  // Handle status update
  const handleUpdateStatus = (appointmentId: string, status: string, notes: string) => {
    updateStatusMutation.mutate({
      appointmentId,
      status,
      serviceNotes: notes || undefined
    }, {
      onSuccess: () => {
        setShowAppointmentDetails(false);
        setSelectedAppointment(null);
        refetchAppointments();
      }
    });
  };
  
  // Find appointments for the selected date
  const selectedDateAppointments = useMemo(() => {
    return formattedAppointments.filter((appointment) => {
      try {
        const appointmentDate = new Date(appointment.scheduledDate);
        return isSameDay(appointmentDate, selectedDate);
      } catch (error) {
        console.error("Error comparing dates:", error);
        return false;
      }
    });
  }, [formattedAppointments, selectedDate]);
  
  // Count appointments in the same time slot
  const countAppointmentsInSameTimeSlot = (appointment: AdminAppointmentType) => {
    if (!appointment) return 0;
    
    return selectedDateAppointments.filter(apt => 
      apt.scheduledTimeSlot.start === appointment.scheduledTimeSlot.start
    ).length;
  };
  
  // Get selected employee name
  const selectedEmployeeName = employeesData?.employees?.find(
    (emp) => emp._id === selectedEmployeeId
  )?.fullName;
  
  // Loading state
  if (isAppointmentsLoading || isEmployeesLoading) {
    return <div className="flex justify-center p-8">Đang tải...</div>;
  }
  
  return (
    <div className="container mx-auto py-6 space-y-4">
      <Card>
        <CardHeader>
          <CalendarHeader 
            selectedEmployeeId={selectedEmployeeId}
            employeeName={selectedEmployeeName}
          />
        </CardHeader>
        <CardContent>
          <CalendarFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            selectedEmployeeId={selectedEmployeeId}
            setSelectedEmployeeId={setSelectedEmployeeId}
            dateRange={dateRange}
            setDateRange={setDateRange}
            calendarView={calendarView}
            setCalendarView={setCalendarView}
            employees={employeesData?.employees || []}
          />
        </CardContent>
      </Card>
      
      <Card className="h-[calc(100vh-280px)] min-h-[600px]">
        <CardContent className="p-0 h-full">
          <CalendarView 
            appointments={formattedAppointments}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            onDateClick={handleDateClick}
            viewType={calendarView}
            onViewTypeChange={handleViewTypeChange}
            workingHoursStart={workHours.start}
            workingHoursEnd={workHours.end}
            workDays={workDays}
            onAppointmentClick={handleAppointmentClick}
          />
        </CardContent>
      </Card>
      
      {/* Appointment Details */}
      <AppointmentDetails 
        open={showAppointmentDetails}
        onOpenChange={setShowAppointmentDetails}
        appointment={selectedAppointment}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={updateStatusMutation.isPending}
        sameTimeSlotCount={selectedAppointment ? countAppointmentsInSameTimeSlot(selectedAppointment) - 1 : 0}
      />
    </div>
  );
};

export default AdminAppointmentsCalendar;