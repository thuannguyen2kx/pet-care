export const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  list: (filters: Record<string, string>) => 
    [...employeeKeys.lists(), filters] as const,
  details: () => [...employeeKeys.all, "detail"] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
  performance: (id: string) => [...employeeKeys.detail(id), "performance"] as const,
  schedule: (id: string, params?: Record<string, string>) => 
    [...employeeKeys.detail(id), "schedule", params] as const,
};