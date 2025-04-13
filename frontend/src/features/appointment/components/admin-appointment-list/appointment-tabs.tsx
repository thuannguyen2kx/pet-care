// src/features/appointment/components/AppointmentsTabs.tsx
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminAppointmentType } from "@/features/appointment/types/api.types";
import { AppointmentsTable } from "./appointment-table";

interface AppointmentsTabsProps {
  todayAppointments: AdminAppointmentType[];
  upcomingAppointments: AdminAppointmentType[];
  pastAppointments: AdminAppointmentType[];
  allAppointments: AdminAppointmentType[];
  onUpdateStatus: (appointment: AdminAppointmentType) => void;
}

export const AppointmentsTabs: React.FC<AppointmentsTabsProps> = ({
  todayAppointments,
  upcomingAppointments,
  pastAppointments,
  allAppointments,
  onUpdateStatus,
}) => {
  return (
    <Tabs defaultValue="today">
      <TabsList className="mb-4">
        <TabsTrigger value="today">
          Hôm nay ({todayAppointments?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="upcoming">
          Sắp tới ({upcomingAppointments?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="past">
          Đã qua ({pastAppointments?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="all">
          Tất cả ({allAppointments?.length || 0})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="today">
        <AppointmentsTable 
          appointments={todayAppointments} 
          onUpdateStatus={onUpdateStatus} 
        />
      </TabsContent>
      
      <TabsContent value="upcoming">
        <AppointmentsTable 
          appointments={upcomingAppointments} 
          onUpdateStatus={onUpdateStatus} 
        />
      </TabsContent>
      
      <TabsContent value="past">
        <AppointmentsTable 
          appointments={pastAppointments} 
          onUpdateStatus={onUpdateStatus} 
        />
      </TabsContent>
      
      <TabsContent value="all">
        <AppointmentsTable 
          appointments={allAppointments} 
          onUpdateStatus={onUpdateStatus} 
        />
      </TabsContent>
    </Tabs>
  );
};