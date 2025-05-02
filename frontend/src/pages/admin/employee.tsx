import { Suspense } from "react";
import EmployeeList from "@/features/employee/components/employee-list";
import { GlobalLoading } from "@/components/shared/global-loading";

const EmployeesPage = () => {
  return (
    <Suspense fallback={<GlobalLoading />}>
      <EmployeeList />
    </Suspense>
  );
};

export default EmployeesPage;
