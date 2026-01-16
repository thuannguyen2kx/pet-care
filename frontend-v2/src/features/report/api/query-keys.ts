import type { TopEmployeeQuery } from '@/features/report/domain/report-state';

export const reportQueryKeys = {
  all: ['report'],
  dashboard: ['report', 'dashboard'],
  top_employees: ['report', 'top-employees'],
  top_employee: (params?: TopEmployeeQuery) => [...reportQueryKeys.top_employees, params],
};
