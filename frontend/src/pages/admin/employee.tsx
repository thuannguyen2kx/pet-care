import { Suspense } from "react";
import EmployeeList from "@/features/employee/components/employee-list";

const EmployeesPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmployeeList />
    </Suspense>
  );
};

export default EmployeesPage;
