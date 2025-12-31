import { keepPreviousData } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

import { useEmployees } from '@/features/employee/api/get-employees';
import { AdminEmployeesListPrecenter } from '@/features/employee/precenters/admin-employees-list.precenter';
import { getEmployeeListFilterSchema } from '@/features/employee/shemas';

export default function AdminEmployeesListContainer() {
  const [searchParams] = useSearchParams();
  const parsed = getEmployeeListFilterSchema.safeParse(Object.fromEntries(searchParams));
  const filter = parsed.success ? parsed.data : getEmployeeListFilterSchema.parse({});
  const { limit, page = 1, specialty, isAcceptingBookings } = filter;

  const employeesQuery = useEmployees({
    filter: {
      specialty,
      isAcceptingBookings,
      page: Number(page),
      limit: Number(limit),
    },
    queryConfig: {
      placeholderData: keepPreviousData,
    },
  });

  const employees = employeesQuery.data?.data.employees ?? [];
  const totalPages = employeesQuery.data?.data.pages ?? 1;

  return (
    <AdminEmployeesListPrecenter
      employees={employees}
      isLoading={employeesQuery.isLoading}
      filter={filter}
      totalPages={totalPages}
    />
  );
}
