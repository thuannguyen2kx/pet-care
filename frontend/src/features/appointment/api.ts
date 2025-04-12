import API from "@/lib/axios-client";
import { format } from "date-fns";
import {
  AdminAppointmentType,
  AppointmentDetailsType,
  TimeSlotType,
  UserAppointmentType,
} from "./types/api.types";

export const getUserAppointmentsQueryFn = async (): Promise<{
  message: "string";
  appointments: UserAppointmentType[];
}> => {
  const response = await API.get(`/appointments`);
  return response.data;
};

export const getAppointmentByIdQueryFn = async (
  id: string
): Promise<{
  message: string;
  appointment: AppointmentDetailsType;
}> => {
  const response = await API.get(`/appointments/${id}`);
  return response.data;
};
export const getAvailableTimeSlotsQueryFn = async ({
  date,
  serviceId,
  serviceType,
}: {
  date?: Date;
  serviceId?: string;
  serviceType?: string;
}): Promise<{ message: string; timeSlot: TimeSlotType }> => {
  const params = new URLSearchParams();

  if (date) {
    params.append("date", format(date, "yyyy-MM-dd"));
  }

  if (serviceId) {
    params.append("serviceId", serviceId);
  }

  if (serviceType) {
    params.append("serviceType", serviceType);
  }

  const response = await API.get(
    `/appointments/time-slots?${params.toString()}`
  );
  return response.data;
};

export const getAllAppointmentsQueryFn = async (params?: {
  status?: string;
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  customerId?: string;
  petId?: string;
}): Promise<{ message: string; appointments: AdminAppointmentType[] }> => {
  const queryParams = new URLSearchParams();

  if (params?.status) {
    queryParams.append("status", params.status);
  }

  if (params?.startDate) {
    queryParams.append("startDate", params.startDate);
  }

  if (params?.endDate) {
    queryParams.append("endDate", params.endDate);
  }

  if (params?.employeeId) {
    queryParams.append("employeeId", params.employeeId);
  }

  if (params?.customerId) {
    queryParams.append("customerId", params.customerId);
  }

  if (params?.petId) {
    queryParams.append("petId", params.petId);
  }

  const response = await API.get(`/admin/all?${queryParams.toString()}`);
  return response.data;
};
export const createAppointmentMutationFn = async (appointmentData: {
  petId: string;
  serviceType: string;
  serviceId: string;
  scheduledDate: string;
  scheduledTimeSlot: {
    start: string;
    end: string;
  };
  notes?: string;
}) => {
  const response = await API.post("/appointments", appointmentData);
  return response.data;
};

export const updateAppointmentMutationFn = async ({
  appointmentId,
  status,
  serviceNotes,
}: {
  appointmentId: string;
  status: string;
  serviceNotes?: string;
}) => {
  const response = await API.put(`/appointments/${appointmentId}/status`, {
    status,
    serviceNotes,
  });
  return response.data;
};

export const canncelAppointmentMutationFn = async (appointmentId: string) => {
  const response = await API.put(`/appointments/${appointmentId}/cancel`);
  return response.data;
};