import { Suspense } from "react";
import EmployeeForm from "@/features/employee/components/employee-form";

const EmployeeCreationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeeForm />
    </Suspense>
  );
};
export default EmployeeCreationPage;
