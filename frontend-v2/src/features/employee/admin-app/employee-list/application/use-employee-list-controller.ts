import { keepPreviousData } from '@tanstack/react-query';

import { useEmployeeListFilter } from '@/features/employee/admin-app/employee-list/application/use-employee-list-filter';
import { useEmployees } from '@/features/employee/api/get-employees';

export const useEmployeeListController = () => {
  const { filters, setFilters } = useEmployeeListFilter();
  const employeesQuery = useEmployees({
    query: filters,
    queryConfig: {
      placeholderData: keepPreviousData,
    },
  });

  return {
    employees: employeesQuery.data?.employees ?? [],
    isLoading: employeesQuery.isLoading,
    filter: filters,
    totalPages: employeesQuery.data?.pages ?? 1,
    setFilters,
  };
};
