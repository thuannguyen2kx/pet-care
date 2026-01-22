// employee-action.keys.ts
export const EMPLOYEE_ACTION_KEYS = {
  EDIT: 'edit-employee',
  DELETE: 'delete-employee',
  TOGGLE_STATUS: 'toggle-employee-status',
} as const;

export type EmployeeActionKey = (typeof EMPLOYEE_ACTION_KEYS)[keyof typeof EMPLOYEE_ACTION_KEYS];
