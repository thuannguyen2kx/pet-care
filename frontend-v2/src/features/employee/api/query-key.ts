import type { EmployeesQuery } from '@/features/employee/domain/employee-state';

export const employeeKeys = {
  all: ['employees'] as const,
  admin: {
    root: () => [...employeeKeys.all, 'admin'] as const,
    lists: () => [...employeeKeys.admin.root(), 'list'] as const,
    list: (params: EmployeesQuery) => [...employeeKeys.admin.lists(), params] as const,
    details: () => [...employeeKeys.admin.root(), 'detail'] as const,
    detail: (id: string) => [...employeeKeys.admin.details(), id] as const,
  },
  employee: {
    root: () => [...employeeKeys.all, 'employee'] as const,
    profile: () => [...employeeKeys.employee.root(), 'profile'] as const,
    dashboard_stats: () => [...employeeKeys.employee.root(), 'dashboard_stats'] as const,
  },
};
