import { StatusUserType } from "@/constants";
import API from "@/lib/axios-client";
import axios from "axios";
import {
  CreateEmployeeDTO,
  EmployeeType,
  GetEmployeePerformanceResponse,
  GetEmployeeScheduleType,
  UpdateEmployeeDTO,
} from "./types/api.types";

// Get all employees with optional filters
export const getAllEmployeesQueryFn = async (filters?: {
  status?: StatusUserType;
  specialty?: string;
}): Promise<{
  message: string;
  employees: EmployeeType[];
}> => {
  const queryParams = new URLSearchParams();

  if (filters?.status) {
    queryParams.append("status", filters.status);
  }

  if (filters?.specialty) {
    queryParams.append("specialty", filters.specialty);
  }

  const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const response = await API.get(`/employees${query}`);
  return response.data;
};

export const getAvailableEmployeeForServiceQueryFn = async (queries: {
  serviceId: string;
  serviceType: string;
  date?: string;
  timeSlot?: string;
}): Promise<{
  message: string;
  employees: EmployeeType[];
}> => {
  const queryParams = new URLSearchParams();
  if (queries.serviceId) {
    queryParams.append("serviceId", queries.serviceId);
  }
  if (queries.serviceType) {
    queryParams.append("serviceType", queries.serviceType);
  }
  if (queries.date) {
    queryParams.append("date", queries.date);
  }
  if (queries.timeSlot) {
    queryParams.append("timeSlot", queries.timeSlot);
  }
  const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const response = await API.get(`/employees/available${query}`);
  return response.data
};

// Get employee by ID
export const getEmployeeByIdQueryFn = async (
  id: string
): Promise<{
  message: string;
  employee: EmployeeType;
}> => {
  const response = await API.get(`/employees/${id}`);

  return response.data;
};

// Create a new employee
export const createEmployeeMutationFn = async (
  employeeData: CreateEmployeeDTO
) => {
  const response = await API.post(`/employees`, employeeData);
  return response.data;
};

// Update an employee
export const updateEmployeeMutationFn = async (
  id: string,
  employeeData: UpdateEmployeeDTO
) => {
  const response = await API.put(`/employees/${id}`, employeeData);
  return response.data;
};

// Delete an employee
export const deleteEmployeeMutationFn = async (id: string) => {
  const response = await API.delete(`/employees/${id}`);
  return response.data;
};

// Upload employee profile picture
export const uploadProfilePictureMutationFn = async (
  id: string,
  imageFile: File
) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await API.post(`/employees/${id}/upload-picture`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Reset employee password
export const resetPasswordMutationFn = async (
  id: string,
  newPassword: string
) => {
  const response = await API.put(`/employees/${id}/reset-password`, {
    newPassword,
  });
  return response.data;
};

// Get employee performance
export const getEmployeePerformanceQueryFn = async (
  id: string
): Promise<GetEmployeePerformanceResponse> => {
  const response = await API.get(`/employees/${id}/performance`);
  return response.data;
};

// Get employee schedule
export const getEmployeeScheduleQueryFn = async (
  id: string,
  params?: { startDate?: string; endDate?: string }
): Promise<GetEmployeeScheduleType> => {
  const queryParams = new URLSearchParams();

  if (params?.startDate) {
    queryParams.append("startDate", params.startDate);
  }

  if (params?.endDate) {
    queryParams.append("endDate", params.endDate);
  }

  const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const response = await API.get(`/employees/${id}/schedule${query}`);
  return response.data;
};

// Update employee availability
export const updateAvailabilityMutationFn = async (
  id: string,
  data: {
    workDays?: string[];
    workHoursStart?: string;
    workHoursEnd?: string;
    vacationStart?: string;
    vacationEnd?: string;
  }
) => {
  const response = await API.put(`/employees/${id}/availability`, data);
  return response.data;
};

// Assign appointment to employee
export const assignAppointment = async (
  employeeId: string,
  appointmentId: string
) => {
  const response = await axios.put(
    `/employees/${employeeId}/assign/${appointmentId}`
  );
  return response.data;
};
