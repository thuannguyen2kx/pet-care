import {
  EMPLOYEE_SPECIALTIES,
  type EmployeeSpecialty,
} from '@/features/employee/domain/employee.entity';

type EmployeeSpecialtyConfig = {
  label: string;
};
export const EMPLOYEE_SPECIALTIES_CONFIG: Record<EmployeeSpecialty, EmployeeSpecialtyConfig> = {
  [EMPLOYEE_SPECIALTIES.GROOMING]: {
    label: 'Chăm sóc lông',
  },
  [EMPLOYEE_SPECIALTIES.SPA]: {
    label: 'Spa thú cưng',
  },
  [EMPLOYEE_SPECIALTIES.HEALTHCARE]: {
    label: 'Chăm sóc sức khỏe',
  },
  [EMPLOYEE_SPECIALTIES.TRAINING]: {
    label: 'Huấn luyện',
  },
  [EMPLOYEE_SPECIALTIES.BOARDING]: {
    label: 'Lưu trú',
  },
};

// ==================
// Helpers
// ==================
export function formatEmployeeSpecialty(employeeSpecialty: EmployeeSpecialty) {
  return EMPLOYEE_SPECIALTIES_CONFIG[employeeSpecialty].label;
}
export function getEmployeeSpecialtyConfig(employeeSpecialty: EmployeeSpecialty) {
  return EMPLOYEE_SPECIALTIES_CONFIG[employeeSpecialty];
}
