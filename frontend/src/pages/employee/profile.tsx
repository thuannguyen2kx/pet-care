
import { Suspense } from "react";
import EmployeeProfile from "@/features/employee/components/employee-profile";

const EmployeeDetailsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeeProfile />
    </Suspense>
  );
};

export default EmployeeDetailsPage;
