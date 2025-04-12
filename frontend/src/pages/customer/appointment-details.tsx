import React from "react";
import AppointmentDetail from "@/features/appointment/components/appointment-details";

const AppointmentDetailPage: React.FC = () => {

  return (
    <>
      <div className="container mx-auto py-6">
        <AppointmentDetail />
      </div>
    </>
  );
};

export default AppointmentDetailPage;