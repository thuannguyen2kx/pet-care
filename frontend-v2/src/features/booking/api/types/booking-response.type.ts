import type { TApiResponseSuccess } from '@/shared/types';

export type TAvailableEmployee = {
  _id: string;
  fullName: string;
  avatar?: string;
  specialties: string[];
  rating: number;
  completedServices: number;
};

export type TGetAvailableEmployeesResponse = {
  employees: TAvailableEmployee[];
};

export type TGetAvailableEmployeesApiResponse = TApiResponseSuccess<TGetAvailableEmployeesResponse>;

export type TAvailaleSlot = {
  startTime: string;
  endTime: string;
  available: boolean;
};

export type TGetAvaiableSlotsResponse = {
  date: string;
  employeeId: string;
  serviceId: string;
  totalSlots: number;
  avaiableSlots: number;
  slots: TAvailaleSlot[];
};
export type TGetAvaiableSlotsApiResponse = TApiResponseSuccess<TGetAvaiableSlotsResponse>;
