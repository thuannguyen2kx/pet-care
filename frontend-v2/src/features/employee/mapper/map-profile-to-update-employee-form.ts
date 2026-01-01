import type { TUpdateEmployeeInput } from '@/features/employee/shemas';
import type { TEmployeeDetail } from '@/features/employee/types';

export const mapProfileToUpdateEmployeeForm = (profile: TEmployeeDetail): TUpdateEmployeeInput => {
  return {
    fullName: profile.fullName,
    phoneNumber: profile.phoneNumber,
    specialties: profile.employeeInfo?.specialties,
    hourlyRate: profile.employeeInfo?.hourlyRate,
    commissionRate: profile.employeeInfo?.commissionRate,
    department: profile.employeeInfo?.department,
    vacationMode: profile.employeeInfo?.vacationMode,
    isAcceptingBookings: profile.employeeInfo?.isAcceptingBookings,
    maxDailyBookings: profile.employeeInfo?.maxDailyBookings,
  };
};
