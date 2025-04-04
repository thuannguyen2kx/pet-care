import { Suspense } from "react";
import EmployeeDetails from "@/features/employee/components/employee-performance";

const EmployeeDetailsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeeDetails />
    </Suspense>
  );
};

export default EmployeeDetailsPage;
