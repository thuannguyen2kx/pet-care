import type { EmployeesQuery } from '@/features/employee/domain/employee-state';

export const employeeQueryKeys = {
  all: ['employees'] as const,
  admin: {
    root: () => [...employeeQueryKeys.all, 'admin'] as const,
    lists: () => [...employeeQueryKeys.admin.root(), 'list'] as const,
    list: (params: EmployeesQuery) => [...employeeQueryKeys.admin.lists(), params] as const,
    details: () => [...employeeQueryKeys.admin.root(), 'detail'] as const,
    detail: (id: string) => [...employeeQueryKeys.admin.details(), id] as const,
  },
  employee: {
    root: () => [...employeeQueryKeys.all, 'employee'] as const,
    profile: () => [...employeeQueryKeys.employee.root(), 'profile'] as const,
    dashboard_stats: () => [...employeeQueryKeys.employee.root(), 'dashboard_stats'] as const,
  },
};
