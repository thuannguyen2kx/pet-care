import { useEmployeeListController } from '@/features/employee/admin-app/employee-list/application/use-employee-list-controller';
import { AdminEmployeesListView } from '@/features/employee/admin-app/employee-list/ui/employee-list-view';

export default function EmployeeListPage() {
  const employeesController = useEmployeeListController();

  return (
    <AdminEmployeesListView
      employees={employeesController.employees}
      isLoading={employeesController.isLoading}
      filter={employeesController.filter}
      totalPages={employeesController.totalPages}
      setFilters={employeesController.setFilters}
    />
  );
}
