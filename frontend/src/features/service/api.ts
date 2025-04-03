import API from '@/lib/axios-client';
import { CreateServiceResponseType, GetServiceResonseType, GetServicesResponseType, ServiceType, UpdateServiceResponeType } from './types/api.types';

export const getServicesQueryFn = async (filters?: { 
  category?: string; 
  petType?: string;
  isActive?: boolean;
}): Promise<GetServicesResponseType> => {
  const params = new URLSearchParams();
  
  if (filters?.category) {
    params.append('category', filters.category);
  }
  
  if (filters?.petType) {
    params.append('petType', filters.petType);
  }
  
  if (filters?.isActive !== undefined) {
    params.append('isActive', filters.isActive.toString());
  }
  
  const response = await API.get("/services", { params });
  return response.data;
};

export const getServiceByIdQueryFn = async (id: string): Promise<GetServiceResonseType> => {
  const response = await API.get(`/services/${id}`);
  return response.data;
};

export const createServiceMutationFn = async (serviceData: FormData): Promise<CreateServiceResponseType> => {
  const response = await API.post(
    `/services`, 
    serviceData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const updateServiceMutationFn = async (id: string, serviceData: Partial<ServiceType>): Promise<UpdateServiceResponeType> => {
  const response = await API.put(
    `/services/${id}`, 
    serviceData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const deleteServiceMutationFn = async (id: string): Promise<UpdateServiceResponeType> => {
  const response = await API.delete(`/services/${id}`);
  return response.data;
};