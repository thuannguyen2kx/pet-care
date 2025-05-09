// src/pages/admin/AdminAppointmentsPage.tsx
import React, { useState } from "react";
import { format, isAfter, isBefore, isToday, addDays, subDays } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AdminAppointmentType } from "@/features/appointment/types/api.types";
import { useGetAllAppointments } from "@/features/appointment/hooks/queries/get-appointments";
import { useGetEmployees } from "@/features/employee/hooks/queries/get-employees";
import { useUpdateAppointmentStatus } from "@/features/appointment/hooks/mutations/update-appointment";
import { StatusUpdateDialog } from "@/features/appointment/components/admin-appointment-list/status-update-dialog";
import { AppointmentsTabs } from "@/features/appointment/components/admin-appointment-list/appointment-tabs";
import { AppointmentsFilters } from "@/features/appointment/components/admin-appointment-list/appointment-filter";
import { AppointmentsHeader } from "@/features/appointment/components/admin-appointment-list/appointment-header";
import { GlobalLoading } from "@/components/shared/global-loading";

// Import components

type DateRange = {
  from: Date | undefined;
  to?: Date;
};

const AdminAppointmentsPage: React.FC = () => {
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [employeeFilter, setEmployeeFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: addDays(new Date(), 7),
  });
  
  // Status update states
  const [selectedAppointment, setSelectedAppointment] = useState<AdminAppointmentType | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  
  // Fetch data
  const { 
    data: appointmentsData, 
    isLoading: isAppointmentsLoading,
    refetch: refetchAppointments
  } = useGetAllAppointments({
    status: statusFilter === "all" ? undefined : statusFilter,
    startDate: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    endDate: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
    employeeId: employeeFilter === "all" ? undefined : employeeFilter,
  });
  
  const { 
    data: employeesData, 
    isLoading: isEmployeesLoading 
  } = useGetEmployees();
  
  const updateStatusMutation = useUpdateAppointmentStatus();
  
  // Filter appointments by search term
  const filteredAppointments = appointmentsData?.appointments?.filter((appointment) => {
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
  }) || [];
  
  // Separate today's, upcoming and past appointments
  const now = new Date();
  const todayAppointments = filteredAppointments.filter((appointment) => 
    isToday(new Date(appointment.scheduledDate))
  );
  
  const upcomingAppointments = filteredAppointments.filter((appointment) => 
    isAfter(new Date(appointment.scheduledDate), now) && 
    !isToday(new Date(appointment.scheduledDate))
  );
  
  const pastAppointments = filteredAppointments.filter((appointment) => 
    isBefore(new Date(appointment.scheduledDate), now) && 
    !isToday(new Date(appointment.scheduledDate))
  );
  
  // Handle opening status dialog
  const handleOpenStatusDialog = (appointment: AdminAppointmentType) => {
    setSelectedAppointment(appointment);
    setShowStatusDialog(true);
  };
  
  // Handle status update
  const handleUpdateStatus = (status: string, notes: string) => {
    if (!selectedAppointment) return;
    
    updateStatusMutation.mutate({
      appointmentId: selectedAppointment._id,
      status: status,
      serviceNotes: notes || undefined
    }, {
      onSuccess: () => {
        setShowStatusDialog(false);
        setSelectedAppointment(null);
        refetchAppointments();
      }
    });
  };
  
  if (isAppointmentsLoading || isEmployeesLoading) {
    return <GlobalLoading/>;
  }
  
  return (
    <>
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <AppointmentsHeader />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filters */}
              <AppointmentsFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                employeeFilter={employeeFilter}
                setEmployeeFilter={setEmployeeFilter}
                dateRange={dateRange}
                setDateRange={setDateRange}
                employees={employeesData?.employees || []}
              />
              
              {/* Appointments Tabs */}
              <AppointmentsTabs 
                todayAppointments={todayAppointments}
                upcomingAppointments={upcomingAppointments}
                pastAppointments={pastAppointments}
                allAppointments={filteredAppointments}
                onUpdateStatus={handleOpenStatusDialog}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Status Update Dialog */}
        <StatusUpdateDialog 
          open={showStatusDialog}
          onOpenChange={setShowStatusDialog}
          appointment={selectedAppointment}
          onUpdateStatus={handleUpdateStatus}
          isUpdating={updateStatusMutation.isPending}
        />
      </div>
    </>
  );
};

export default AdminAppointmentsPage;
