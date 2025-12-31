// employee-action.keys.ts
export const EmployeeActionKey = {
  EDIT: 'edit-employee',
  DELETE: 'delete-employee',
  TOGGLE_STATUS: 'toggle-employee-status',
} as const;

export type TEmployeeActionKey = (typeof EmployeeActionKey)[keyof typeof EmployeeActionKey];
