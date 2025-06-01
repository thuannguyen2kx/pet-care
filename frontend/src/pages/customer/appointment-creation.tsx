import AppointmentFormStep from "@/features/appointment/components/create-appointment-form";
import React from "react";

const AppointmentCreationPage: React.FC = () => {
  return (
    <>
      <div className="container mx-auto py-6">
        <AppointmentFormStep />
      </div>
    </>
  );
};

export default AppointmentCreationPage 